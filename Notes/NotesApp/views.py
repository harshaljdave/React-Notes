from rest_framework import generics, viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import User, Note, Folder, Tag, SharedNote, models
from .serializers import UserSerializer, NoteSerializer, FolderSerializer, TagSerializer, SharedNoteSerializer, RegisterSerializer
from .filters import NoteFilter
from .permissions import IsOwner, IsOwnerOrShared

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class TagViewSet(viewsets.ModelViewSet):
    serializer_class = TagSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Tag.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class FolderViewSet(viewsets.ModelViewSet):
    serializer_class = FolderSerializer
    permission_classes = [IsAuthenticated, IsOwner]

    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class NoteViewSet(viewsets.ModelViewSet):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrShared]
    filter_backends = [DjangoFilterBackend]
    filterset_class = NoteFilter

    def get_queryset(self):
        # Return notes created by the user or shared with the user
        return Note.objects.filter(
            models.Q(created_by=self.request.user) | models.Q(sharednote__shared_with=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

    def perform_update(self, serializer):
        serializer.save(edited_by=self.request.user)

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        note = self.get_object()
        note.favorited_by.add(request.user)
        return Response({'status': 'note favorited'})

    @action(detail=True, methods=['post'])
    def unfavorite(self, request, pk=None):
        note = self.get_object()
        note.favorited_by.remove(request.user)
        return Response({'status': 'note unfavorited'})

    @action(detail=True, methods=['post'])
    def add_to_folder(self, request, pk=None):
        note = self.get_object()
        folder_id = request.data.get('folder_id')
        if folder_id:
            try:
                folder = Folder.objects.get(id=folder_id, user=request.user)
                note.folders.add(folder)
                return Response({'status': 'note added to folder'})
            except Folder.DoesNotExist:
                return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'folder_id not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def remove_from_folder(self, request, pk=None):
        note = self.get_object()
        folder_id = request.data.get('folder_id')
        if folder_id:
            try:
                folder = Folder.objects.get(id=folder_id, user=request.user)
                note.folders.remove(folder)
                return Response({'status': 'note removed from folder'})
            except Folder.DoesNotExist:
                return Response({'error': 'Folder not found'}, status=status.HTTP_404_NOT_FOUND)
        return Response({'error': 'folder_id not provided'}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        note = self.get_object()
        note.is_archived = True
        note.save()
        return Response({'status': 'note archived'})

    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        note = self.get_object()
        note.is_archived = False
        note.save()
        return Response({'status': 'note unarchived'})

class SharedNoteViewSet(viewsets.ModelViewSet):
    serializer_class = SharedNoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Return notes shared by the user or shared with the user
        return SharedNote.objects.filter(
            models.Q(shared_by=self.request.user) | models.Q(shared_with=self.request.user)
        ).distinct()

    def perform_create(self, serializer):
        # Get the note from the request data
        note_id = self.request.data.get('note')
        note = Note.objects.get(id=note_id)
        # Check if the user has permission to share the note
        if note.created_by != self.request.user:
            raise serializers.ValidationError("You do not have permission to share this note.")
        serializer.save(shared_by=self.request.user)