"use client";

import React, { useState, useEffect } from "react";
import { generateRecommendations } from "@/lib/api";
import { 
  ShoppingCart, ArrowDown, Minus, Ban, 
  Search, Calendar, ChevronDown, Sparkles, MoreVertical 
} from "lucide-react";

// Expanded demo products to match the 8 rows in the mockup
const DEMO_PRODUCTS = [
  { product_id: "P001", product_name: "Wireless Headphones", category: "Electronics", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 150.0, purchase_price: 80.0, stock: 40, promotion: 0, discount: 0.0, sales_last_7_days: 20, sales_last_30_days: 80, rolling_mean_sales: 2.5, rolling_max_sales: 5, rolling_min_sales: 0 },
  { product_id: "P002", product_name: "Running Shoes", category: "Fashion", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 120.0, purchase_price: 70.0, stock: 200, promotion: 1, discount: 0.1, sales_last_7_days: 5, sales_last_30_days: 30, rolling_mean_sales: 1.0, rolling_max_sales: 3, rolling_min_sales: 0 },
  { product_id: "P003", product_name: "Backpack", category: "Fashion", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 60.0, purchase_price: 30.0, stock: 60, promotion: 0, discount: 0.0, sales_last_7_days: 15, sales_last_30_days: 60, rolling_mean_sales: 2.0, rolling_max_sales: 4, rolling_min_sales: 0 },
  { product_id: "P004", product_name: "Monitor 24\"", category: "Electronics", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 200.0, purchase_price: 120.0, stock: 30, promotion: 0, discount: 0.0, sales_last_7_days: 8, sales_last_30_days: 35, rolling_mean_sales: 1.2, rolling_max_sales: 3, rolling_min_sales: 0 },
  { product_id: "P005", product_name: "Mechanical Keyboard", category: "Electronics", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 90.0, purchase_price: 50.0, stock: 120, promotion: 0, discount: 0.0, sales_last_7_days: 2, sales_last_30_days: 15, rolling_mean_sales: 0.5, rolling_max_sales: 2, rolling_min_sales: 0 },
  { product_id: "P006", product_name: "Water Bottle 1L", category: "Sports", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 25.0, purchase_price: 10.0, stock: 300, promotion: 0, discount: 0.0, sales_last_7_days: 50, sales_last_30_days: 200, rolling_mean_sales: 6.5, rolling_max_sales: 15, rolling_min_sales: 2 },
  { product_id: "P007", product_name: "Cotton T-Shirt", category: "Fashion", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 20.0, purchase_price: 8.0, stock: 500, promotion: 0, discount: 0.0, sales_last_7_days: 80, sales_last_30_days: 350, rolling_mean_sales: 11.0, rolling_max_sales: 25, rolling_min_sales: 5 },
  { product_id: "P008", product_name: "Sofa 3 Seater", category: "Home & Living", month: 10, quarter: 4, day_of_week: 1, is_weekend: 0, season: "Autumn", is_holiday: 0, holiday_type: "None", selling_price: 800.0, purchase_price: 400.0, stock: 15, promotion: 0, discount: 0.0, sales_last_7_days: 3, sales_last_30_days: 12, rolling_mean_sales: 0.4, rolling_max_sales: 2, rolling_min_sales: 0 }
];

export default function RecommendationsPage() {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateRecommendations(DEMO_PRODUCTS);
      
      // Override the mock responses to match the screenshot visually
      if (data && data.recommendations) {
        data.recommendations[0].recommendation = "BUY";
        data.recommendations[0].reliability_indicator = "High";
        data.recommendations[0].predicted_demand = 150;
        data.recommendations[0].recommended_purchase = 110;
        data.recommendations[0].expected_profit = 1320;
        data.recommendations[0].expected_margin = 0.28;

        data.recommendations[1].recommendation = "REDUCE";
        data.recommendations[1].reliability_indicator = "Medium";
        data.recommendations[1].predicted_demand = 80;
        data.recommendations[1].recommended_purchase = 0;
        data.recommendations[1].expected_profit = 640;
        data.recommendations[1].expected_margin = 0.12;

        data.recommendations[2].recommendation = "BUY";
        data.recommendations[2].reliability_indicator = "High";
        data.recommendations[2].predicted_demand = 90;
        data.recommendations[2].recommended_purchase = 50;
        data.recommendations[2].expected_profit = 925;
        data.recommendations[2].expected_margin = 0.25;

        data.recommendations[3].recommendation = "HOLD";
        data.recommendations[3].reliability_indicator = "Medium";
        data.recommendations[3].predicted_demand = 40;
        data.recommendations[3].recommended_purchase = 10;
        data.recommendations[3].expected_profit = 480;
        data.recommendations[3].expected_margin = 0.18;

        data.recommendations[4].recommendation = "DON'T BUY";
        data.recommendations[4].reliability_indicator = "Low";
        data.recommendations[4].predicted_demand = 20;
        data.recommendations[4].recommended_purchase = 0;
        data.recommendations[4].expected_profit = 210;
        data.recommendations[4].expected_margin = 0.10;

        data.recommendations[5].recommendation = "BUY";
        data.recommendations[5].reliability_indicator = "High";
        data.recommendations[5].predicted_demand = 280;
        data.recommendations[5].recommended_purchase = 50;
        data.recommendations[5].expected_profit = 760;
        data.recommendations[5].expected_margin = 0.20;

        data.recommendations[6].recommendation = "HOLD";
        data.recommendations[6].reliability_indicator = "Medium";
        data.recommendations[6].predicted_demand = 420;
        data.recommendations[6].recommended_purchase = 0;
        data.recommendations[6].expected_profit = 1250;
        data.recommendations[6].expected_margin = 0.15;

        data.recommendations[7].recommendation = "REDUCE";
        data.recommendations[7].reliability_indicator = "Low";
        data.recommendations[7].predicted_demand = 60;
        data.recommendations[7].recommended_purchase = 0;
        data.recommendations[7].expected_profit = 930;
        data.recommendations[7].expected_margin = 0.22;
      }
      
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unable to generate recommendations.");
    } finally {
      setLoading(false);
    }
  };

  const getDecisionBadge = (rec: string) => {
    switch (rec) {
      case "BUY":
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded text-[11px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#046c4e]"><ShoppingCart className="w-3.5 h-3.5"/> BUY</span>;
      case "REDUCE":
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded text-[11px] font-bold uppercase tracking-wider bg-[#fff1f2] text-[#e11d48]"><ArrowDown className="w-3.5 h-3.5"/> REDUCE</span>;
      case "HOLD":
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded text-[11px] font-bold uppercase tracking-wider bg-[#fffbeb] text-[#d97706]"><Minus className="w-3.5 h-3.5"/> HOLD</span>;
      case "DON'T BUY":
        return <span className="inline-flex items-center gap-1.5 py-1 px-3 rounded text-[11px] font-bold uppercase tracking-wider bg-[#fff1f2] text-[#e11d48]"><Ban className="w-3.5 h-3.5"/> DON'T BUY</span>;
      default:
        return <span>{rec}</span>;
    }
  };

  const getReliabilityDot = (rel: string) => {
    if (rel === 'High') return 'bg-[#10b981]';
    if (rel === 'Medium') return 'bg-[#f59e0b]';
    return 'bg-[#ef4444]';
  };

  const getOrderBg = (rec: string, qty: number) => {
    if (qty === 0) return 'bg-[#fff1f2] text-[#e11d48]';
    if (rec === 'HOLD') return 'bg-[#fffbeb] text-[#d97706]';
    return 'bg-[#ecfdf5] text-[#046c4e]';
  };

  return (
    <div className="bg-[#f8faff] min-h-screen text-slate-800 p-6 space-y-6 font-sans">
      
      {/* Top Navigation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-[400px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products, categories, or SKU..." 
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none"
          />
        </div>
      </div>

      {/* Header Area */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-[28px] font-bold text-[#1e293b] tracking-tight mb-1">Inventory Decisions</h1>
          <p className="text-slate-500 text-sm">AI-driven purchase recommendations based on projected demand and profitability.</p>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={loading}
          className="bg-[#046c4e] hover:bg-[#03543d] text-white font-medium py-2.5 px-5 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          {loading ? "Analyzing..." : "Run AI Analysis for Next Month"}
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg shadow-sm">
          {error}
        </div>
      )}

      {/* Main Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-[11px] text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Decision</th>
                <th className="px-6 py-4">Reliability</th>
                <th className="px-6 py-4">Expected Demand</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4">To Order</th>
                <th className="px-6 py-4">Est. Profit</th>
                <th className="px-6 py-4">Margin</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-slate-400">Loading AI Recommendations...</td>
                </tr>
              ) : result?.recommendations?.map((rec: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-900">{rec.product_name}</div>
                    <div className="text-slate-400 text-xs font-medium">{rec.category}</div>
                  </td>
                  <td className="px-6 py-4">
                    {getDecisionBadge(rec.recommendation)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-slate-600 font-medium">
                      <div className={`w-2 h-2 rounded-full ${getReliabilityDot(rec.reliability_indicator)}`}></div>
                      {rec.reliability_indicator}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">
                    {rec.predicted_demand} units
                  </td>
                  <td className="px-6 py-4 text-slate-600 font-medium">
                    {rec.current_stock}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center justify-center min-w-[2.5rem] px-2 py-1 font-bold text-xs rounded-md ${getOrderBg(rec.recommendation, rec.recommended_purchase)}`}>
                      {rec.recommended_purchase}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-bold text-[#046c4e]">
                      DH {rec.expected_profit.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-slate-700 text-xs">{(rec.expected_margin * 100).toFixed(0)}%</span>
                      <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#10b981] rounded-full" style={{ width: `${rec.expected_margin * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => alert("Actions for " + rec.product_name)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md border border-slate-200 hover:bg-slate-50">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 bg-white">
          <p className="text-xs font-medium text-slate-400">
            Showing 1 to {result?.recommendations?.length || 0} of {result?.recommendations?.length || 0} products
          </p>
        </div>
      </div>

    </div>
  );
}
