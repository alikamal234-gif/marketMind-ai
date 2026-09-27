# Retail module API

Start FastAPI from `backend/` with `uvicorn app.main:app --reload` after
installing `backend/requirements.txt`. The imported model files are under
`ml/retail/models/`, resolved independently of the launch directory.

## Price estimate

`POST /api/retail/price`

```json
{
  "product_id": "TV-55",
  "product_name": "Samsung Smart TV 55 4K UHD",
  "category": "MULTIMÉDIA",
  "brand": "SAMSUNG",
  "subcategory": "TV",
  "unit": "PIÈCE",
  "quantity": "1",
  "availability": "Available",
  "source_retailer": "Aswak Assalam",
  "date": "2026-09-27"
}
```

Returns `product_id`, `predicted_price_mad`, `model`, and `model_target`.
Provide descriptive fields from the actual product for a meaningful estimate.

## Retail decision

`POST /api/retail/decision` accepts the price fields above, plus:

```json
{
  "current_price_mad": 7000,
  "current_stock": 30,
  "expected_demand": 100,
  "safety_stock": 20,
  "margin_percentage": 18,
  "anomaly_detected": false,
  "demand_source": "demo"
}
```

Combine both objects in one JSON request. Returns `decision`,
`recommended_quantity`, `reason`, `predicted_price_mad`,
`price_difference_percentage`, and source labels. `expected_demand` must cover
the same planning period as the stock and safety stock assumptions. The
decision rules are a demonstration heuristic, not a validated purchasing
optimization. Existing `POST /api/predictions/demand` is unchanged.
