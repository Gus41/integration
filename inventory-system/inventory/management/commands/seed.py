from django.core.management.base import BaseCommand
from faker import Faker
from inventory.models import Item
import random

fake = Faker()

class Command(BaseCommand):

    def handle(self, *args, **kwargs):

        if Item.objects.exists():
            return

        for i in range(100):
            Item.objects.create(
                sku=f"ITEM-{i:03}",
                name=fake.word().capitalize(),
                description=fake.sentence(),
                price=random.randint(10,500),
                quantity=random.randint(5,100)
            )

        self.stdout.write("100 itens criados.")