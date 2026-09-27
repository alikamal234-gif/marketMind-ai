# Dataset Schema

This document defines the schema for the business and marketplace data used by MarketMind AI.

## Expected Columns

| Column Name     | Data Type | Description |
|-----------------|-----------|-------------|
| `product_id`    | String    | Unique identifier for the product. |
| `store_id`      | String    | Unique identifier for the store/location. |
| `date`          | Date      | Date of the recorded metrics (YYYY-MM-DD). |
| `category`      | String    | Product category (e.g., Dairy, Bakery). |
| `price`         | Float     | Selling price of the product. |
| `quantity_sold` | Integer   | Target Variable: Number of units sold on the given date. |
| `stock`         | Integer   | Inventory level at the end of the day. |
| `searches`      | Integer   | Number of times the product was searched by users. |
| `views`         | Integer   | Number of times the product page was viewed. |
| `orders`        | Integer   | Number of unique orders containing this product. |
| `location`      | String    | Store location (e.g., city or region). |

## Potential Future Columns

- `competitor_price`: Price of similar products at competing stores.
- `promotion`: Boolean indicating if the product was on sale.
- `day_of_week`: Derived feature (1-7).
- `month`: Derived feature (1-12).
- `season`: Derived feature (Spring, Summer, Fall, Winter).
