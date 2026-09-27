# Retail price module

This module came from the uploaded Brev `marketmind-ai.zip`. It adds 5,235
retail product observations, two smaller supplementary JSON sources, a saved
XGBoost price regressor, its fitted preprocessor, and decision rules.

The existing demand model remains in `ml/src/`. Its training dataset and
model are separate. The imported retail observations have no measured sales,
searches, views, orders, or stock values, so they cannot train a demand model.
The decision endpoint requires an explicit expected demand and labels its
source (`demand_model`, `historical`, or `demo`).

The price model predicts an observed retail price in MAD. It does not estimate
an optimal price or a causal change in demand. Its uploaded evaluation metadata
reports MAE 82.95 MAD on its original split; this merge did not reproduce that
evaluation. Review the provenance and licensing of the supplied JSON before
redistribution or commercial use.
The saved preprocessor was created with scikit-learn 1.9.1, which is pinned in
the backend requirements to keep its serialized format compatible.

## Run from the repository root

```bash
pip install -r backend/requirements.txt
python -m ml.retail.src.models.predict_price
python -m ml.retail.src.orchestrator.run_pipeline
```

The FastAPI app exposes `POST /api/retail/price` and
`POST /api/retail/decision`; see `docs/retail-api.md`.
