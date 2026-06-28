from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    inventory_api: str = "http://inventory:8000/api/items/"
    sales_api: str = "http://sales:3000/api"

    class Config:
        env_file = ".env"


settings = Settings()