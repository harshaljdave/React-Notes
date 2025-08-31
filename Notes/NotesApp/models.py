from django.contrib.auth.models import AbstractUser
from django.db import models

# The User model we already created is fine, but we'll use it here.
class User(AbstractUser):
    email = models.EmailField(unique=True)

class Tag(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tags')

    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name

class Folder(models.Model):
    name = models.CharField(max_length=50)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('name', 'user')

    def __str__(self):
        return self.name

class Note(models.Model):
    title = models.CharField(max_length=250)
    content = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes_created")
    edited_by = models.ForeignKey(User, on_delete=models.SET_NULL, blank=True, null=True, related_name="notes_edited")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_archived = models.BooleanField(default=False) # For archiving functionality
    
    # Simplified Many-to-Many relationships
    folders = models.ManyToManyField(Folder, blank=True, related_name='notes')
    tags = models.ManyToManyField(Tag, blank=True, related_name='notes')
    favorited_by = models.ManyToManyField(User, related_name="favorite_notes", blank=True)

    def __str__(self):
        return self.title

class SharedNote(models.Model):
    note = models.ForeignKey(Note, on_delete=models.CASCADE)
    shared_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes_shared_by")
    shared_with = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes_shared_with")
    shared_at = models.DateTimeField(auto_now_add=True)
    permission = models.CharField(max_length=10, choices=[('view', 'View'), ('edit', 'Edit')], default='view')

    class Meta:
        # Ensure a note is shared with a user only once
        unique_together = ('note', 'shared_with')

    def __str__(self):
        return f'"{self.note.title}" shared with {self.shared_with.username}'
