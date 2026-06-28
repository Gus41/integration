from fastapi import APIRouter

from services.inventory import inventory_service

router = APIRouter(prefix="/inventory", tags=["Inventory"])


@router.get("/items")
async def get_items():

    return await inventory_service.get_items()