from fastapi import APIRouter
from pydantic import BaseModel
from app.services.product_service import product_service

router = APIRouter()

class ProductCreate(BaseModel):
    name: str
    category: str
    price: float
    stock: int

@router.get("/")
def get_products():
    return product_service.get_all_products()

@router.post("/")
def add_product(product: ProductCreate):
    return product_service.add_product(product.model_dump())

from typing import List
from fastapi import Body

@router.post("/bulk")
def add_products_bulk(products: List[dict] = Body(...)):
    return product_service.add_products_bulk(products)
