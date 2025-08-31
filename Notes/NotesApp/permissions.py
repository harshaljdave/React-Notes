from rest_framework import permissions

class IsOwner(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the snippet.
        return obj.user == request.user

class IsOwnerOrShared(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object or shared users to view/edit it.
    """
    def has_object_permission(self, request, view, obj):
        # The user is the owner
        if obj.created_by == request.user:
            return True

        # The note is shared with the user
        shared_note = obj.sharednote_set.filter(shared_with=request.user).first()
        if shared_note:
            # If the request is a safe method (GET, HEAD, OPTIONS), allow access
            if request.method in permissions.SAFE_METHODS:
                return True
            # If the request is a write method (POST, PUT, PATCH, DELETE), check for 'edit' permission
            elif shared_note.permission == 'edit':
                return True
        
        return False

