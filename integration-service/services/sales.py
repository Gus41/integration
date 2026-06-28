import httpx

from schemas import SaleRequest
from config import settings


async def create_sale(data: SaleRequest):

    async with httpx.AsyncClient() as client:

        # Busca o produto
        response = await client.get(
            settings.inventory_api,
            params={"sku": data.productCode},
        )

        response.raise_for_status()

        items = response.json()

        if not items:
            return {
                "success": False,
                "message": "Product not found"
            }

        item = items[0]

        # Valida estoque
        if item["quantity"] < data.quantity:
            return {
                "success": False,
                "message": "Insufficient stock"
            }

        new_quantity = item["quantity"] - data.quantity

        # Atualiza estoque no Django
        patch = await client.patch(
            f"{settings.inventory_api}{item['id']}/",
            json={
                "sku": item["sku"],
                "name": item["name"],
                "description": item["description"],
                "price": item["price"],
                "quantity": new_quantity,
            },
        )

        patch.raise_for_status()

        # Registra venda no Next.js
        sale = await client.post(
            settings.sales_api + '/sales/middleware',
            json={
                "productCode": item["sku"],
                "quantity": data.quantity,
                "unitPrice": float(item["price"]),
            },
        )

        sale.raise_for_status()

        return {
            "success": True,
            "inventory": patch.json(),
            "sale": sale.json(),
        }