"use client";

import React, { useState } from "react";
import { predictDemand } from "@/lib/api";
import { 
  TrendingUp, AlertTriangle, CheckCircle, Package, 
  Search, Calendar, ChevronDown, BarChart2, ShieldAlert, ShoppingCart
} from "lucide-react";
import { 
  ComposedChart, Line, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine 
} from "recharts";

// Mock forecast data to match the UI chart
const forecastData = [
  { month: 'Apr', historical: 5 },
  { month: 'May', historical: 6.5 },
  { month: 'Jun', historical: 6.5 },
  { month: 'Jul', historical: 8 },
  { month: 'Aug', historical: 7.8 },
  { month: 'Sep', historical: 9 },
  { month: 'Oct', historical: 8.8, predicted: 8.8, range: [8.8, 8.8] },
  { month: 'Nov', predicted: 10.5, range: [8, 14] },
  { month: 'Dec', predicted: 11.5, range: [9, 16] },
];

export default function PredictionsPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    product_id: "P001",
    category: "Electronics",
    price: 25,
    stock: 20,
    searches: 500,
    views: 1200,
    orders: 80,
    month: 9,
    day_of_week: 6,
    generate_insights: true
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: (name === "product_id" || name === "category") ? value : Number(value) 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    // Compute derived fields for the new ML schema
    const month = formData.month;
    const dayOfWeek = formData.day_of_week;
    const quarter = Math.ceil(month / 3);
    const isWeekend = (dayOfWeek === 5 || dayOfWeek === 6) ? 1 : 0;
    
    let season = 'Winter';
    if (month >= 3 && month <= 5) season = 'Spring';
    else if (month >= 6 && month <= 8) season = 'Summer';
    else if (month >= 9 && month <= 11) season = 'Fall';

    const payload = {
      product_id: formData.product_id,
      month: month,
      quarter: quarter,
      day_of_week: dayOfWeek,
      is_weekend: isWeekend,
      season: season,
      is_holiday: 0,
      holiday_type: "None",
      category: formData.category,
      selling_price: formData.price,
      purchase_price: formData.price * 0.6,
      stock: formData.stock,
      promotion: 0,
      discount: 0.0,
      sales_last_7_days: formData.orders / 4,
      sales_last_30_days: formData.orders,
      rolling_mean_sales: formData.orders / 30,
      rolling_max_sales: formData.orders / 10,
      rolling_min_sales: 0,
      generate_insights: formData.generate_insights
    };

    try {
      const data = await predictDemand(payload);
      // Enrich data with mocked UI fields for layout purposes
      data.prob = data.stockout_risk === 'HIGH' ? '85%' : data.stockout_risk === 'MEDIUM' ? '45%' : '12%';
      data.trend = "+18%";
      data.rec = data.stockout_risk === 'HIGH' ? 'BUY' : data.stockout_risk === 'MEDIUM' ? 'BUY' : 'HOLD';
      data.recQty = data.stockout_risk === 'HIGH' ? 15 : data.stockout_risk === 'MEDIUM' ? 5 : 0;
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Unable to generate prediction. Please verify that the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f8faff] min-h-screen text-slate-800 p-6 space-y-6 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products, categories..." 
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none"
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#1e1b4b] mb-1 tracking-tight">Demand Prediction</h1>
        <p className="text-slate-500 text-sm">Predict future demand for a product using our machine learning model.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Product Information Form */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col">
          <h3 className="text-lg font-bold text-slate-900 mb-6 tracking-tight">Product Information</h3>
          
          <form onSubmit={handleSubmit} className="space-y-5 flex-1 flex flex-col">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Product ID</label>
              <div className="relative">
                <input type="text" name="product_id" value={formData.product_id} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none pr-10" />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Category</label>
              <div className="relative">
                <select name="category" value={formData.category} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none appearance-none bg-white">
                  <option value="Electronics">Electronics</option>
                  <option value="Fashion">Fashion</option>
                  <option value="Home">Home</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Price (DH)</label>
                <input type="number" name="price" value={formData.price} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Current Stock (units)</label>
                <input type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Recent Searches</label>
                <input type="number" name="searches" value={formData.searches} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Page Views</label>
                <input type="number" name="views" value={formData.views} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Previous Orders</label>
                <input type="number" name="orders" value={formData.orders} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Month</label>
                <div className="relative">
                  <select name="month" value={formData.month} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none appearance-none bg-white">
                    <option value="9">September</option>
                    <option value="10">October</option>
                    <option value="11">November</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Day of Week</label>
              <div className="relative">
                <select name="day_of_week" value={formData.day_of_week} onChange={handleChange} className="w-full border border-slate-200 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-[#046c4e] outline-none appearance-none bg-white">
                  <option value="6">Sunday</option>
                  <option value="0">Monday</option>
                  <option value="5">Saturday</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            
            <div className="mt-auto pt-6">
              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-[#046c4e] hover:bg-[#03543d] text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-md shadow-emerald-900/20 disabled:opacity-50"
              >
                <BarChart2 className="w-5 h-5" />
                {loading ? "Predicting..." : "Predict Demand"}
              </button>
            </div>
          </form>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}
        </div>

        {/* Right Column: Prediction Result */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col min-h-[600px]">
          <h3 className="text-xl font-bold text-slate-900 mb-6 tracking-tight">Prediction Result</h3>
          
          {result ? (
            <div className="flex-1 flex flex-col">
              
              {/* 3 Metrics Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-[#f0fdf4] p-4 rounded-xl flex gap-4 items-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm shrink-0">
                    <TrendingUp className="w-6 h-6 text-[#046c4e]" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Predicted Demand</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800">{Number(result.predicted_demand).toFixed(2)}</span>
                      <span className="text-sm font-medium text-slate-600">units</span>
                    </div>
                    <p className="text-xs text-emerald-600 font-bold mt-1">↑ {result.trend} vs last period</p>
                  </div>
                </div>

                <div className="bg-[#f8fafc] p-4 rounded-xl flex gap-4 items-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm shrink-0 border border-slate-100">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Current Stock</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl font-black text-slate-800">{result.stock}</span>
                      <span className="text-sm font-medium text-slate-600">units</span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#fff1f2] p-4 rounded-xl flex gap-4 items-center">
                  <div className="bg-white p-3 rounded-lg shadow-sm shrink-0 border border-rose-50">
                    <ShieldAlert className="w-6 h-6 text-rose-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-0.5">Stock-out Risk</p>
                    <span className="text-2xl font-black text-slate-800 block">{result.stockout_risk === 'LOW' ? 'Low' : result.stockout_risk === 'MEDIUM' ? 'Med' : 'High'}</span>
                    <p className="text-xs text-slate-500 mt-1">Probability: {result.prob}</p>
                  </div>
                </div>
              </div>

              {/* Chart */}
              <div className="flex-1 mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h4 className="text-sm font-bold text-slate-800">Demand Forecast (Next 6 Months)</h4>
                  <div className="flex gap-4 text-xs font-semibold text-slate-600">
                    <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-[#046c4e]"></div> Historical Sales</span>
                    <span className="flex items-center gap-1.5"><div className="w-4 h-0.5 border-t-2 border-dashed border-[#046c4e]"></div> Predicted Demand</span>
                  </div>
                </div>
                <div className="w-full h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                      <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 1, strokeDasharray: '4 4'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                      <ReferenceLine x="Oct" stroke="#94a3b8" strokeDasharray="3 3" />
                      
                      {/* Confidence interval area */}
                      <Area type="monotone" dataKey="range" stroke="none" fill="#046c4e" fillOpacity={0.1} />
                      
                      <Line type="monotone" dataKey="historical" stroke="#046c4e" strokeWidth={2} dot={{ r: 4, fill: '#046c4e', stroke: '#fff', strokeWidth: 2 }} activeDot={{ r: 6 }} />
                      <Line type="monotone" dataKey="predicted" stroke="#046c4e" strokeWidth={2} strokeDasharray="5 5" dot={{ r: 2, fill: '#046c4e' }} />
                    </ComposedChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-[10px] text-center text-slate-400 mt-2 font-medium">Units</div>
              </div>

              {/* Recommendation block */}
              <div className="bg-[#ecfdf5] rounded-xl p-5 border border-[#d1fae5] flex items-center justify-between">
                <div className="flex items-start gap-4">
                  <div className="bg-[#046c4e] p-3 rounded-lg text-white mt-1">
                    <ShoppingCart className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 mb-1">Recommendation</h4>
                    <p className="text-2xl font-black text-[#046c4e] mb-2">{result.rec}</p>
                    <p className="text-sm text-slate-600">
                      We recommend purchasing <span className="font-bold">{result.recQty} additional units</span> to meet the expected demand.
                    </p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-sm text-center min-w-[150px]">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Recommended Quantity</p>
                  <p className="text-xl font-black text-slate-900">{result.recQty} units</p>
                </div>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50">
              <div className="text-center">
                <BarChart2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 font-medium">Enter parameters and click Predict Demand<br/>to see the ML results here.</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
    </div>
  );
}
