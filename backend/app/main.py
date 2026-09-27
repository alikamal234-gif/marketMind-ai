from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import predictions, dashboard, products, insights, assistant, recommendations, feedback, retail
app = FastAPI(title="MarketMind AI API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(predictions.router, prefix="/api/predictions", tags=["predictions"])
app.include_router(retail.router, prefix="/api/retail", tags=["retail"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(insights.router, prefix="/api/insights", tags=["insights"])
app.include_router(assistant.router, prefix="/api/assistant", tags=["assistant"])
app.include_router(recommendations.router, prefix="/api/recommendations", tags=["recommendations"])
app.include_router(feedback.router, prefix="/api/feedback", tags=["feedback"])

@app.get("/")
def root():
    return {"message": "Welcome to MarketMind AI API"}
