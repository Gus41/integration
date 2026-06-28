from fastapi import FastAPI

from routers.inventory import router as inventory_router
from routers.sales import router as sales_router

app = FastAPI(title="Integration Service")

app.include_router(inventory_router)
app.include_router(sales_router)