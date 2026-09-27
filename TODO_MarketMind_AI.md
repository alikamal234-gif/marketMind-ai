# MarketMind AI - Remaining Tasks Backlog

This document tracks the features and architectural requirements defined in the `MarketMind AI Project Specification` PDF that are either incomplete or require refactoring to transition the project from a linear prediction pipeline into a true **Multi-Model Orchestrated AI Platform**.

## 1. Multi-Model Architecture Expansion (Section 3)
Currently, XGBoost handles all features (seasonality, discounts, etc.) internally. We need to split or simulate distinct specialized models:
- [x] **Anomaly Detection Model**: Create a service to detect unusual spikes or drops in demand/price.
- [x] **Sales Trend Model**: Create a dedicated module to calculate sales momentum (e.g., +18% trend).
- [x] **Seasonality Model**: Isolate the seasonal demand categorization (High/Medium/Low).
- [x] **Price / Promotion Model**: Dedicated service to analyze price elasticity.

## 2. Upper-Level AI Orchestrator (Section 4)
Currently, the backend calls the decision service directly. We need to implement the Orchestrator.
- [x] Create `orchestrator_service.py`.
- [x] The orchestrator must aggregate outputs from the specialized models (Demand, Trend, Seasonality, Inventory, Profitability, Anomaly).
- [x] Implement conflict resolution (e.g., if Demand is high but Anomaly is detected, adjust confidence).
- [x] Pass a unified "Decision Context" to the deterministic Decision Engine.

## 3. Reliability / Confidence Indicator (Section 10)
The final output requires a reliability/confidence score for each recommendation.
- [x] Calculate a confidence percentage (e.g., 85%) based on data completeness, orchestrator consensus, and XGBoost variance.
- [x] Add the "Reliability Indicator" column to the Frontend Decision Engine table (`/recommendations`).
- [x] Update Backend schemas (`RecommendationResponse`) to include `reliability_score`.

## 4. Continuous Learning & Feedback Loop (Section 9)
The system must support updating datasets with actual sales and evaluating prediction errors.
- [x] Create an API endpoint (`POST /api/feedback/sales`) to ingest actual monthly sales.
- [x] Implement a function to calculate prediction error (MAE / RMSE) for past predictions.
- [x] Create a strategy/scheduler stub for periodic model retraining.

## 5. Cleanups
- [x] Update `.env.example` to remove PostgreSQL references and accurately reflect the MongoDB and Groq setup.
