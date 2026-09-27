# MarketMind AI

## Merged retail price module

The uploaded Brev project is integrated under [`ml/retail/`](ml/retail/README.md).
It adds Moroccan retail product observations, a trained price estimator, and
a decision engine alongside the existing demand model and dashboard. FastAPI
exposes `POST /api/retail/price` and `POST /api/retail/decision`; see
[`docs/retail-api.md`](docs/retail-api.md) for request examples. Install
`backend/requirements.txt` to load the saved model. Demand prediction still
uses its own separate model and training data.

AI-powered business intelligence platform for local retailers and small businesses.
Transforms raw business data into actionable market intelligence.

## Features
- Demand Forecasting
- Stock Risk Prediction
- Market Demand Insights
- Price / Demand Analysis
- AI Business Assistant

## Project Structure
- `data/`: Raw and processed data
- `ml/`: Machine Learning notebooks, scripts, and saved models
- `backend/`: FastAPI application for predictions and AI integration
- `frontend/`: Next.js dashboard
- `docs/`: Architecture and dataset documentation




# MarketMind AI — Complete Project Specification & Development Plan

## 1. Project Overview

We are building **MarketMind AI**, an AI-powered business intelligence platform for local retailers and small businesses.

The main goal is to help businesses make data-driven decisions instead of relying only on intuition.

The platform will analyze business and marketplace data such as:

* Product sales
* Product prices
* Stock levels
* Customer searches
* Product views
* Orders
* Product categories
* Dates
* Seasonal patterns
* Store/location information
* Potential competitor prices

The system will use Machine Learning to predict demand and identify inventory risks, and an AI assistant to explain the predictions and provide understandable business insights.

The project is being developed as an MVP for a one-day AI hackathon.

We must prioritize a **small, functional, demonstrable MVP** instead of trying to build a complete production platform.

---

# 2. Main Problem

Small/local businesses often make decisions without sufficient data.

A store owner may not know:

* Which products are becoming popular
* Which products are losing demand
* How much stock will be needed
* Which products may run out soon
* Which products may become overstocked
* How demand may change after a price change
* What customers in the local market are searching for
* Which products should receive more attention

MarketMind AI aims to transform raw business data into actionable insights.

---

# 3. Main Value Proposition

The core concept is:

> **"Help local businesses understand what their market needs and make better decisions using AI and data."**

The platform should answer questions such as:

* What products will likely have high demand?
* Which products are at risk of running out of stock?
* Which products may be overstocked?
* Which products have increasing demand?
* Which products have decreasing demand?
* How could a price change affect expected demand?
* What should the business pay attention to?

---

# 4. Important Scope Decision

Do NOT try to build a complete marketplace during the hackathon.

The original concept included:

* Customer marketplace
* Nearby stores
* Maps
* Product search
* Price comparison
* Service providers
* Store discovery

These ideas can remain part of the long-term product vision.

For the hackathon MVP, focus primarily on:

> **AI-powered business intelligence and prediction for local businesses.**

The web application should demonstrate the business intelligence side.

---

# 5. MVP Core Features

The MVP should contain these main features:

## Feature 1 — Demand Forecasting

Use historical data to predict future product demand.

Example:

Input:

* Product
* Price
* Historical sales
* Searches
* Views
* Orders
* Stock
* Date
* Category

Output:

```text
Predicted demand: 17 units/day
```

---

## Feature 2 — Stock Risk Prediction

Use demand predictions and current stock to estimate stock-out risk.

Example:

```text
Product: Milk

Current stock: 40 units
Expected daily demand: 17 units

Estimated stock coverage: ~2.3 days

Risk: HIGH
```

The system should also identify possible overstock.

---

## Feature 3 — Market Demand Insights

Identify products with increasing or decreasing demand.

Example:

```text
Rising demand:

Milk       +27%
Eggs       +19%
Oil        +14%

Declining demand:

Product X  -18%
Product Y  -11%
```

---

## Feature 4 — Price / Demand Analysis

Analyze the relationship between price and demand.

The system may simulate different price scenarios.

Example:

```text
Current price: 10 DH

Scenario A:
Price = 10 DH
Expected demand = 120

Scenario B:
Price = 9 DH
Expected demand = 138

Scenario C:
Price = 8 DH
Expected demand = 151
```

Do NOT present the prediction as a guaranteed optimal price.

Present it as a model-based scenario or estimate.

---

## Feature 5 — AI Business Assistant

The AI assistant should explain ML predictions in natural language.

Example:

ML output:

```text
Predicted demand = 17 units/day
Demand trend = +27%
Stock risk = HIGH
```

AI assistant response:

> "Recent sales and search activity indicate increasing demand for this product. Current stock may only cover approximately two to three days of expected demand."

The LLM should explain predictions rather than replace the ML models.

---

# 6. AI Architecture

Separate Machine Learning from Generative AI.

## Machine Learning

Responsible for:

* Demand prediction
* Stock risk
* Demand trends
* Price-demand analysis

Potential models:

1. Linear Regression — baseline
2. Random Forest
3. Gradient Boosting / XGBoost

Start simple.

Do not immediately use deep learning if traditional ML performs sufficiently for the MVP.

---

## Generative AI

Responsible for:

* Explaining predictions
* Answering business questions
* Summarizing trends
* Turning numerical predictions into understandable insights

Possible tools:

* Ollama
* Hugging Face
* Gemini
* Groq

The system should be designed so the LLM can be replaced without changing the core ML pipeline.

---

# 7. Technology Stack

## Frontend

Use:

* Next.js
* TypeScript
* Tailwind CSS
* shadcn/ui
* Recharts or Chart.js
* Lucide icons

The frontend should be a professional business dashboard.

---

## Backend

Use:

* Python
* FastAPI
* REST API

FastAPI will expose endpoints for:

* Predictions
* Products
* Dashboard statistics
* AI assistant

---

## Machine Learning

Use:

* Python
* Pandas
* NumPy
* scikit-learn
* XGBoost if necessary
* Joblib
* Jupyter Notebook
* Matplotlib
* Seaborn

---

## Database

Use:

* PostgreSQL

Possible entities:

```text
users
stores
products
sales
inventory
searches
orders
```

For the hackathon, keep the database schema simple.

---

## AI / LLM

Possible tools:

* Ollama
* Hugging Face
* Gemini / AI Studio
* Groq

Use whichever provides the best balance between availability, speed and quality.

The application must have a fallback.

---

## Development

Use:

* Git
* GitHub
* Docker
* Docker Compose if useful

---

# 8. Project Architecture

Use this structure:

```text
marketmind-ai/
│
├── README.md
├── .gitignore
├── .env.example
├── docker-compose.yml
│
├── data/
│   ├── raw/
│   │   └── .gitkeep
│   ├── processed/
│   │   └── .gitkeep
│   └── README.md
│
├── ml/
│   ├── notebooks/
│   │   ├── 01_eda.ipynb
│   │   ├── 02_preprocessing.ipynb
│   │   ├── 03_training.ipynb
│   │   └── 04_evaluation.ipynb
│   │
│   ├── src/
│   │   ├── __init__.py
│   │   ├── config.py
│   │   ├── data_loader.py
│   │   ├── preprocessing.py
│   │   ├── features.py
│   │   ├── train.py
│   │   ├── evaluate.py
│   │   └── predict.py
│   │
│   ├── models/
│   │   ├── demand_model.joblib
│   │   └── preprocessor.joblib
│   │
│   ├── requirements.txt
│   └── README.md
│
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── config.py
│   │   │
│   │   ├── api/
│   │   │   ├── routes/
│   │   │   │   ├── predictions.py
│   │   │   │   ├── products.py
│   │   │   │   ├── dashboard.py
│   │   │   │   └── assistant.py
│   │   │   └── router.py
│   │   │
│   │   ├── services/
│   │   │   ├── prediction_service.py
│   │   │   └── ai_service.py
│   │   │
│   │   └── schemas/
│   │       ├── prediction.py
│   │       └── product.py
│   │
│   ├── requirements.txt
│   └── README.md
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   ├── products/
│   │   ├── predictions/
│   │   ├── assistant/
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── charts/
│   │   ├── dashboard/
│   │   ├── products/
│   │   └── ui/
│   │
│   ├── lib/
│   │   └── api.ts
│   │
│   └── types/
│       └── index.ts
│
└── docs/
    ├── architecture.md
    ├── dataset.md
    └── api.md
```

---

# 9. Data Strategy

Initially, keep:

```text
data/raw/
```

empty.

Do not invent private or confidential data.

Define the expected dataset schema before adding data.

Expected columns:

```text
product_id
store_id
date
category
price
quantity_sold
stock
searches
views
orders
location
```

Potential future columns:

```text
competitor_price
promotion
day_of_week
month
season
```

The dataset can later be:

* Public retail data
* Synthetic data
* Properly licensed data

For the hackathon, synthetic data can be used to demonstrate the pipeline if suitable public data is unavailable.

---

# 10. ML Target

Primary target:

```text
quantity_sold
```

The first model should predict future demand.

Example:

```text
Features
    ↓
price
stock
searches
views
orders
category
month
day_of_week
    ↓
ML model
    ↓
Predicted quantity_sold
```

---

# 11. ML Pipeline

Implement the following pipeline:

```text
Load data
    ↓
Validate data
    ↓
Clean data
    ↓
Handle missing values
    ↓
Convert data types
    ↓
Feature engineering
    ↓
Train/Test split
    ↓
Baseline model
    ↓
Model comparison
    ↓
Evaluation
    ↓
Select best model
    ↓
Save model
```

Evaluate using appropriate regression metrics:

* MAE
* RMSE
* R²

Do not choose a model only because it has the highest R². Consider MAE/RMSE and practical usefulness.

---

# 12. Model Serialization

Save the final model using Joblib:

```text
ml/models/demand_model.joblib
```

Also save the preprocessing pipeline:

```text
ml/models/preprocessor.joblib
```

Prefer saving the complete preprocessing + model pipeline together when practical, to avoid training/production preprocessing inconsistencies.

---

# 13. Prediction API

FastAPI should expose an endpoint such as:

```text
POST /api/predictions/demand
```

Example request:

```json
{
  "product_id": "P001",
  "price": 8.5,
  "stock": 40,
  "searches": 120,
  "views": 350,
  "orders": 80,
  "month": 9,
  "day_of_week": 6
}
```

Example response:

```json
{
  "predicted_demand": 17,
  "stockout_risk": "medium"
}
```

The exact response format can evolve during implementation.

---

# 14. Frontend Dashboard

Build a clean business dashboard.

Main sections:

## Overview

Show:

* Total products
* Sales
* Low-stock products
* High-demand products
* Demand trend

## Demand Forecast

Display:

* Historical demand
* Predicted demand
* Trend chart

## Stock Risk

Display:

* High-risk products
* Medium-risk products
* Possible overstock

## Market Insights

Display:

* Rising products
* Declining products
* High-demand categories

## Product Analysis

For each product show:

```text
Current Price
Current Stock
Average Daily Sales
Predicted Demand
Stock Risk
Demand Trend
```

## AI Assistant

Provide a chat-like interface where the business owner can ask:

* Why is demand increasing?
* Which products need attention?
* What are the main risks?
* Summarize my current market situation.

---

# 15. AI Assistant Architecture

Do not allow the LLM to invent numerical predictions.

The flow should be:

```text
Database / ML model
        ↓
Structured prediction
        ↓
AI service
        ↓
LLM
        ↓
Natural-language explanation
```

The LLM receives trusted structured data from the ML layer.

Example:

```json
{
  "product": "Milk",
  "predicted_demand": 17,
  "demand_change": 27,
  "current_stock": 40,
  "stockout_risk": "high"
}
```

Then it explains the information.

---

# 16. Development Environment

Use Python 3.12 for the ML/backend environment.

Create a virtual environment:

```bash
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install the initial ML dependencies:

```bash
pip install pandas numpy scikit-learn matplotlib seaborn jupyter joblib
```

Add XGBoost only if needed.

Do not install unnecessary AI libraries until the AI phase.

---

# 17. Development Phases

Follow these phases strictly.

## Phase 1 — Repository and Environment

Tasks:

* Create Git repository
* Create project structure
* Create Python environment
* Create `.gitignore`
* Create `.env.example`
* Create README
* Define dataset schema

Do not build UI yet.

---

## Phase 2 — Data Layer

Tasks:

* Define data contract
* Prepare `data/raw`
* Prepare `data/processed`
* Document dataset schema
* Add public or synthetic data when available

---

## Phase 3 — ML

Tasks:

* EDA
* Data cleaning
* Feature engineering
* Baseline model
* Random Forest / Gradient Boosting
* XGBoost if useful
* Evaluation
* Model selection
* Save final model

The first success criterion is:

> A working demand prediction model that can receive input features and return a prediction.

---

## Phase 4 — Backend

Tasks:

* Create FastAPI project
* Create prediction service
* Load saved model
* Create prediction endpoint
* Add validation with Pydantic
* Test API

Success criterion:

```text
Frontend-independent API
        ↓
Input
        ↓
Prediction
        ↓
JSON response
```

---

## Phase 5 — Frontend

Tasks:

* Create Next.js application
* Configure Tailwind
* Configure shadcn/ui
* Build dashboard
* Build product analysis page
* Build charts
* Connect frontend to FastAPI

Success criterion:

> A user can see real model predictions inside the web application.

---

## Phase 6 — AI Assistant

Tasks:

* Choose available LLM provider
* Create AI service
* Define prompt
* Pass structured ML results to LLM
* Build assistant interface
* Test hallucination prevention

Success criterion:

> The assistant can explain actual model predictions without inventing data.

---

## Phase 7 — Integration

Complete flow:

```text
User
 ↓
Web Dashboard
 ↓
FastAPI
 ↓
ML Model
 ↓
Prediction
 ↓
AI Assistant
 ↓
Business Insight
```

---

## Phase 8 — Demo Preparation

Prepare one clear scenario.

Example:

```text
1. Business uploads/uses sales data
2. System analyzes historical data
3. Model predicts demand
4. System detects stock risk
5. Dashboard displays insights
6. AI assistant explains the situation
7. Business owner receives actionable information
```

The demo should focus on one strong use case rather than many incomplete features.

---

# 18. Hackathon Scope

This is a one-day hackathon.

Therefore:

DO:

* Build a working prototype
* Use a small dataset
* Use existing models
* Reuse existing libraries
* Focus on one strong ML prediction
* Build a polished dashboard
* Demonstrate AI integration

DO NOT:

* Train a huge model from scratch
* Build a complete e-commerce platform
* Build payments
* Build delivery
* Build a complex mobile app
* Build a huge recommendation system
* Build many unrelated AI features

---

# 19. NVIDIA / GPU Strategy

GPU is NOT required for the traditional ML models.

CPU is sufficient for:

* Pandas
* preprocessing
* scikit-learn
* XGBoost
* demand forecasting

GPU can be used for:

* LLM inference
* embedding generation
* experimentation with larger open-source models

Potential tools:

* Ollama
* Hugging Face
* PyTorch
* Transformers
* Sentence Transformers

If NVIDIA Brev is available, use it primarily for AI inference and embedding workloads.

Do not falsely claim that traditional tabular ML requires a strong GPU.

---

# 20. Fallback Strategy

If GPU access is unavailable:

Use:

* Smaller open-source models
* Ollama if local hardware permits
* Gemini
* Groq
* Hugging Face inference where available
* CPU-based ML

The MVP must remain functional without Brev.

---

# 21. Git Strategy

Use clear commits:

```text
chore: initialize project structure
chore: setup ml environment
feat: add dataset schema
feat: add data preprocessing
feat: train demand model
feat: add model evaluation
feat: create prediction API
feat: create dashboard
feat: integrate AI assistant
fix: improve prediction validation
docs: update README
```

Do not commit:

```text
.env
.venv/
__pycache__/
large datasets
model caches
API keys
private data
```

---

# 22. Team Responsibilities

If there are 4–5 team members:

### Member 1 — ML / Data

Responsible for:

* Dataset
* EDA
* preprocessing
* training
* evaluation
* model

### Member 2 — Backend / AI

Responsible for:

* FastAPI
* prediction API
* AI service
* LLM integration

### Member 3 — Frontend

Responsible for:

* Next.js
* dashboard
* charts
* UI

### Member 4 — Integration / QA

Responsible for:

* frontend/backend integration
* testing
* bug fixing
* deployment/demo

### Member 5 — Product / UX / Pitch

Responsible for:

* UX
* product flow
* demo scenario
* presentation
* documentation

Team members can combine roles depending on team size.

---

# 23. Final Product Architecture

The final MVP should look like:

```text
                    MARKETMIND AI
                          │
              ┌───────────┴───────────┐
              │                       │
           Business                Data
           Dashboard                 │
              │                      │
              ↓                      ↓
          Next.js                PostgreSQL
              │                      │
              └──────────┬───────────┘
                         ↓
                      FastAPI
                         │
              ┌──────────┴──────────┐
              ↓                     ↓
          ML Service             AI Service
              │                     │
       Demand Model          LLM / Embeddings
              │                     │
              └──────────┬──────────┘
                         ↓
                  Business Insights
```

---

# 24. Final Demo Goal

The final demo should communicate this simple story:

> A local business has historical sales and inventory data, but does not know what the market will need next.

MarketMind AI analyzes the data.

The ML model predicts demand.

The system identifies inventory risks and market trends.

The AI assistant explains the predictions.

The business owner gets data-driven insights that can help with inventory and pricing decisions.

The core message is:

> **"From raw business data to actionable market intelligence."**

---

# 25. Development Rule

Do not generate the entire application at once.

Work incrementally.

At each phase:

1. Explain what we are doing.
2. Create only the necessary files.
3. Give the exact commands.
4. Explain important code.
5. Run/test the current step.
6. Fix errors before moving forward.
7. Only then continue to the next phase.

Never skip validation.

Do not invent datasets, API keys, credentials, GPU specifications or business results.

When data is not available, use a clearly identified synthetic dataset or wait for a real/public dataset.

The priority is:

**Working MVP > number of features.**

Start with **Phase 1: repository structure and ML environment setup**.
