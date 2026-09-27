"use client";

import React from "react";
import { 
  Search, Calendar, ChevronDown, 
  TrendingUp, TrendingDown, BarChart2,
  Coffee, Milk, Croissant, Apple, Sprout
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

const sparkBlue = [{v:10},{v:15},{v:12},{v:20},{v:25},{v:22},{v:35}];
const sparkRed = [{v:30},{v:25},{v:28},{v:20},{v:15},{v:18},{v:10}];

const risingProducts = [
  { emoji: "🍞", name: "Local Bread", category: "Bakery", trend: "+25%" },
  { emoji: "🥤", name: "Coca-Cola 1L", category: "Beverages", trend: "+15%" },
  { emoji: "🥚", name: "Eggs 30pcs", category: "Dairy", trend: "+10%" },
  { emoji: "🍌", name: "Bananas", category: "Fruits", trend: "+8%" },
  { emoji: "🍚", name: "Rice 1kg", category: "Grains", trend: "+7%" },
];

const decliningProducts = [
  { emoji: "🧥", name: "Winter Coats", category: "Fashion", trend: "-40%" },
  { emoji: "☕", name: "Hot Chocolate", category: "Beverages", trend: "-20%" },
  { emoji: "🧣", name: "Scarves", category: "Fashion", trend: "-15%" },
  { emoji: "🪟", name: "Electric Heaters", category: "Electronics", trend: "-12%" },
  { emoji: "☔", name: "Umbrellas", category: "Fashion", trend: "-10%" },
];

const popularCategories = [
  { icon: Coffee, name: "Beverages", volume: "High Volume", percent: 85 },
  { icon: Milk, name: "Dairy", volume: "High Volume", percent: 70 },
  { icon: Croissant, name: "Bakery", volume: "Medium Volume", percent: 50 },
  { icon: Apple, name: "Fruits & Vegetables", volume: "Medium Volume", percent: 45 },
  { icon: Sprout, name: "Grains", volume: "Low Volume", percent: 30 },
];

export default function InsightsPage() {
  return (
    <div className="bg-[#f8faff] min-h-screen text-slate-800 p-6 space-y-8 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products, categories, or insights..." 
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-[#5145cd] outline-none"
          />
        </div>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-[#1e1b4b] mb-2 tracking-tight font-serif">Market Insights</h1>
        <p className="text-slate-500 text-sm">Discover trends and category performance based on market data.</p>
      </div>

      {/* 3 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Rising Demand Column (Blue Theme) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-blue-50 p-3 rounded-2xl">
              <TrendingUp className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Rising Demand</h3>
              <p className="text-xs text-slate-500 font-medium">Products with increasing demand this period.</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {risingProducts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-600 flex items-center justify-end gap-1">
                    ↑ {item.trend}
                  </p>
                </div>
                <div className="w-16 h-8 ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkBlue}>
                      <Line type="monotone" dataKey="v" stroke="#2563eb" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declining Demand Column (Red Theme) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-rose-50 p-3 rounded-2xl">
              <TrendingDown className="w-8 h-8 text-rose-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Declining Demand</h3>
              <p className="text-xs text-slate-500 font-medium">Products with decreasing demand this period.</p>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            {decliningProducts.map((item, idx) => (
              <div key={idx} className="flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{item.name}</h4>
                  <p className="text-[11px] text-slate-400 font-medium">{item.category}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-600 flex items-center justify-end gap-1">
                    ↓ {item.trend}
                  </p>
                </div>
                <div className="w-16 h-8 ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sparkRed}>
                      <Line type="monotone" dataKey="v" stroke="#e11d48" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Categories Column (Slate Theme) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex flex-col min-h-[600px]">
          <div className="flex items-start gap-4 mb-8">
            <div className="bg-slate-100 p-3 rounded-2xl">
              <BarChart2 className="w-8 h-8 text-slate-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-1">Popular Categories</h3>
              <p className="text-xs text-slate-500 font-medium">Categories ranked by total demand volume.</p>
            </div>
          </div>

          <div className="flex-1 space-y-8 mt-2">
            {popularCategories.map((item, idx) => (
              <div key={idx} className="flex items-center gap-5">
                <div className="w-10 h-10 rounded-full border-2 border-[#1e293b] flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[#1e293b]" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-end mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">{item.volume}</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[#334155] rounded-full" 
                      style={{ width: `${item.percent}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
