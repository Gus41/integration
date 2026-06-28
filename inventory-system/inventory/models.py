from django.db import models

# Create your models here.

class Item(models.Model):
    sku = models.CharField(
        max_length=20,
        unique=True,
        db_index=True
    )
    name = models.CharField(max_length=120)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)