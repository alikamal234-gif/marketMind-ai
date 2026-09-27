export interface DemandPredictionRequest {
    product_id: string;
    price: number;
    stock: number;
    searches: number;
    views: number;
    orders: number;
    category: string;
    month: number;
    day_of_week: number;
    generate_insights?: boolean;
}

export interface DemandPredictionResponse {
    product_id: string;
    predicted_demand: number;
    stockout_risk: "low" | "medium" | "high";
    insights?: string;
}

export interface DashboardMetrics {
    total_products: number;
    high_risk_stock: number;
    rising_demand_count: number;
    market_activity: string;
}

export interface ProductSummary {
    product_id: string;
    name: string;
    category: string;
    price: number;
    current_stock: number;
}
