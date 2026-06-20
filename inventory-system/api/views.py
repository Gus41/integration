from rest_framework import viewsets, filters
from rest_framework.permissions import AllowAny

from inventory.models import Item
from .serializers import ItemSerializer


class ItemViewSet(viewsets.ModelViewSet):
	"""API CRUD for Item"""
	queryset = Item.objects.all().order_by('-created_at')
	serializer_class = ItemSerializer
	permission_classes = [AllowAny]
	filter_backends = [filters.SearchFilter, filters.OrderingFilter]
	search_fields = ['name', 'description']
	ordering_fields = ['price', 'quantity', 'created_at']
