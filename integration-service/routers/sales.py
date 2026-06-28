from fastapi import APIRouter

from schemas import SaleRequest
from services.sales import create_sale

router = APIRouter(
    prefix="/sales",
    tags=["Sales"]
)


@router.post("/")
async def sale(data: SaleRequest):
    return await create_sale(data)