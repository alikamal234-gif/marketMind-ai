"""Smoke test for the imported price artifact and the new HTTP contract."""

import unittest

from fastapi import FastAPI
from fastapi.testclient import TestClient

from app.api.routes.retail import router


class RetailAPITest(unittest.TestCase):
    def setUp(self):
        app = FastAPI()
        app.include_router(router, prefix="/api/retail")
        self.client = TestClient(app)
        self.product = {
            "product_id": "TV-55",
            "product_name": "Samsung Smart TV 55 4K UHD",
            "category": "MULTIMÉDIA",
            "brand": "SAMSUNG",
            "subcategory": "TV",
            "unit": "PIÈCE",
            "quantity": "1",
            "availability": "Available",
            "source_retailer": "Aswak Assalam",
            "date": "2026-09-27",
        }

    def test_price_and_decision(self):
        price = self.client.post("/api/retail/price", json=self.product)
        self.assertEqual(price.status_code, 200)
        self.assertGreater(price.json()["predicted_price_mad"], 0)

        decision = self.client.post("/api/retail/decision", json={
            **self.product,
            "current_price_mad": 7000,
            "current_stock": 30,
            "expected_demand": 100,
            "safety_stock": 20,
            "margin_percentage": 18,
            "demand_source": "demo",
        })
        self.assertEqual(decision.status_code, 200)
        self.assertEqual(decision.json()["demand_source"], "demo")
        self.assertEqual(decision.json()["recommended_quantity"], 90)

    def test_reject_unlabeled_demand(self):
        response = self.client.post("/api/retail/decision", json={
            **self.product,
            "current_price_mad": 10,
            "current_stock": 5,
            "expected_demand": 20,
        })
        self.assertEqual(response.status_code, 422)


if __name__ == "__main__":
    unittest.main()
