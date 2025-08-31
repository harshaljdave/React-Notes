from django_filters import rest_framework as filters
from .models import Note

class NoteFilter(filters.FilterSet):
    title = filters.CharFilter(lookup_expr='icontains')
    content = filters.CharFilter(lookup_expr='icontains')
    favorited = filters.BooleanFilter(field_name='favorited_by', method='filter_favorited')

    class Meta:
        model = Note
        fields = ['title', 'content', 'folders', 'tags', 'is_archived', 'favorited']

    def filter_favorited(self, queryset, name, value):
        user = self.request.user
        if value and user.is_authenticated:
            return queryset.filter(favorited_by=user)
        return queryset

