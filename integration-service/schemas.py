from pydantic import BaseModel

class SaleRequest(BaseModel):
    productCode: str
    quantity: int