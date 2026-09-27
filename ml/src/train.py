import os
import pandas as pd
import numpy as np
import joblib
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from xgboost import XGBRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# MAPE implementation handling zeroes
def mean_absolute_percentage_error(y_true, y_pred):
    y_true, y_pred = np.array(y_true), np.array(y_pred)
    # Avoid division by zero
    non_zero_idx = y_true != 0
    if np.sum(non_zero_idx) == 0:
        return 0.0
    return np.mean(np.abs((y_true[non_zero_idx] - y_pred[non_zero_idx]) / y_true[non_zero_idx])) * 100

# Paths
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
DATA_PATH = os.path.join(BASE_DIR, "data", "raw", "synthetic_sales_data.csv")
MODEL_DIR = os.path.join(BASE_DIR, "ml", "models")
MODEL_PATH = os.path.join(MODEL_DIR, "demand_model.joblib")
PREPROCESSOR_PATH = os.path.join(MODEL_DIR, "preprocessor.joblib")

def main():
    print("Loading data...")
    if not os.path.exists(DATA_PATH):
        print(f"Data not found at {DATA_PATH}. Please generate it first.")
        return
        
    df = pd.read_csv(DATA_PATH)
    
    # Feature Engineering
    print("Engineering features...")
    df['date'] = pd.to_datetime(df['date'])
    df = df.sort_values(by=['product_id', 'date']).reset_index(drop=True)
    
    # Temporal features
    df['day_of_week'] = df['date'].dt.dayofweek
    df['is_weekend'] = df['day_of_week'].apply(lambda x: 1 if x >= 5 else 0)
    df['quarter'] = df['date'].dt.quarter
    
    # Rolling features per product
    df['sales_last_7_days'] = df.groupby('product_id')['units_sold'].transform(lambda x: x.shift(1).rolling(window=7, min_periods=1).sum())
    df['sales_last_30_days'] = df.groupby('product_id')['units_sold'].transform(lambda x: x.shift(1).rolling(window=30, min_periods=1).sum())
    
    df['rolling_mean_sales'] = df.groupby('product_id')['units_sold'].transform(lambda x: x.shift(1).rolling(window=30, min_periods=1).mean())
    df['rolling_max_sales'] = df.groupby('product_id')['units_sold'].transform(lambda x: x.shift(1).rolling(window=30, min_periods=1).max())
    df['rolling_min_sales'] = df.groupby('product_id')['units_sold'].transform(lambda x: x.shift(1).rolling(window=30, min_periods=1).min())
    
    # Fill NAs created by shifting
    df = df.fillna(0)
    
    # Target and Features
    target = 'units_sold'
    features = [
        'month', 'quarter', 'day_of_week', 'is_weekend', 'season',
        'is_holiday', 'holiday_type', 'category', 'selling_price', 'purchase_price',
        'stock', 'promotion', 'discount', 
        'sales_last_7_days', 'sales_last_30_days',
        'rolling_mean_sales', 'rolling_max_sales', 'rolling_min_sales'
    ]
    
    # Ensure categorical columns are strictly strings
    categorical_features = ['season', 'holiday_type', 'category']
    for col in categorical_features:
        df[col] = df[col].astype(str)
        
    # Chronological Split (Time-Aware Training)
    # Train on first 80% of time, Test on last 20%
    print("Splitting data chronologically...")
    split_date = df['date'].quantile(0.8)
    
    train_df = df[df['date'] < split_date].copy()
    test_df = df[df['date'] >= split_date].copy()
    
    # Preprocessing
    numeric_features = [
        'month', 'quarter', 'day_of_week', 'is_weekend', 'is_holiday',
        'selling_price', 'purchase_price', 'stock', 'promotion', 'discount',
        'sales_last_7_days', 'sales_last_30_days',
        'rolling_mean_sales', 'rolling_max_sales', 'rolling_min_sales'
    ]
        
    X_train = train_df[features]
    y_train = train_df[target]
    
    X_test = test_df[features]
    y_test = test_df[target]
    
    print(f"Training set: {len(X_train)} records")
    print(f"Testing set: {len(X_test)} records")
    
    numeric_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    
    categorical_transformer = Pipeline(steps=[
        ('imputer', SimpleImputer(strategy='constant', fill_value='missing')),
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', numeric_transformer, numeric_features),
            ('cat', categorical_transformer, categorical_features)
        ])
    
    print("\n--- Training XGBoost Regressor ---")
    xgb = Pipeline(steps=[('preprocessor', preprocessor),
                          ('regressor', XGBRegressor(
                              n_estimators=100, 
                              learning_rate=0.1, 
                              max_depth=5,
                              random_state=42
                          ))])
    
    xgb.fit(X_train, y_train)
    
    print("\n--- Evaluating Model ---")
    y_pred = xgb.predict(X_test)
    # Prevent negative predictions
    y_pred = np.maximum(0, y_pred)
    
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)
    mape = mean_absolute_percentage_error(y_test, y_pred)
    
    print(f"MAE:  {mae:.2f}")
    print(f"RMSE: {rmse:.2f}")
    print(f"R²:   {r2:.2f}")
    print(f"MAPE: {mape:.2f}%")
    
    # Evaluate and Save
    print("\nSaving best model...")
    os.makedirs(MODEL_DIR, exist_ok=True)
    
    joblib.dump(xgb, MODEL_PATH)
    print(f"Model saved to {MODEL_PATH}")
    
    joblib.dump(preprocessor, PREPROCESSOR_PATH)
    print(f"Preprocessor saved to {PREPROCESSOR_PATH}")

if __name__ == "__main__":
    main()
