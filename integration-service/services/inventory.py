import httpx

from config import settings


class InventoryService:

    async def get_items(self):

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{settings.inventory_api}/api/items/"
            )

        response.raise_for_status()

        return response.json()


inventory_service = InventoryService()