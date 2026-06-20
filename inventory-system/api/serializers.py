from rest_framework import serializers
from inventory.models import Item


class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'
        read_only_fields = ('id', 'created_at', 'updated_at')
