from rest_framework import serializers
from .models import User, Note, Folder, Tag, SharedNote

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('username', 'password', 'email', 'first_name', 'last_name')

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data['password'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        extra_kwargs = {
            'email': {'required': True}
        }

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class FolderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Folder
        fields = '__all__'

class NoteSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    folders = FolderSerializer(many=True, read_only=True)
    created_by = UserSerializer(read_only=True)
    edited_by = UserSerializer(read_only=True)

    class Meta:
        model = Note
        fields = '__all__'
        read_only_fields = ['created_by', 'edited_by']

class SharedNoteSerializer(serializers.ModelSerializer):
    note = NoteSerializer(read_only=True)
    shared_by = UserSerializer(read_only=True)
    shared_with = UserSerializer()

    class Meta:
        model = SharedNote
        fields = '__all__'

