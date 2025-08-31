from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import UserViewSet, NoteViewSet, FolderViewSet, TagViewSet, SharedNoteViewSet, RegisterView

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'notes', NoteViewSet, basename='note')
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'tags', TagViewSet, basename='tag')
router.register(r'shared-notes', SharedNoteViewSet, basename='sharednote')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='auth_register'),
    path('', include(router.urls)),
]