"use client";

import React, { useEffect, useState } from "react";
import { getProducts } from "@/lib/api";
import { 
  Package, ShoppingCart, AlertTriangle, Tag, Plus, 
  Search, Filter, Calendar, ChevronRight, ChevronLeft, MoreHorizontal, Info
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

// Mock sparkline data
const tinyChartData1 = [{v:10},{v:15},{v:12},{v:20},{v:18},{v:25},{v:22}];
const tinyChartData2 = [{v:15},{v:12},{v:20},{v:18},{v:25},{v:22},{v:30}];
const tinyChartData3 = [{v:20},{v:22},{v:18},{v:25},{v:28},{v:25},{v:35}];
const tinyChartData4 = [{v:10},{v:12},{v:15},{v:14},{v:18},{v:19},{v:22}];

const sparkGreen = [{v:10},{v:15},{v:12},{v:20},{v:25},{v:22},{v:35}];
const sparkRed = [{v:30},{v:25},{v:28},{v:20},{v:15},{v:18},{v:10}];
const sparkAmber = [{v:20},{v:22},{v:18},{v:25},{v:20},{v:15},{v:22}];

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  async function fetchProducts() {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (e) {
      console.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const paginatedProducts = products.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Use some logic to enrich basic products with mock UI fields since backend might not have them all
  const enrichedProducts = paginatedProducts.map((p, i) => {
    const isLowStock = p.stock < 50;
    const rec = p.risk === 'HIGH' ? 'REDUCE' : p.risk === 'MEDIUM' ? 'HOLD' : 'BUY';
    return {
      ...p,
      sku: p.product_id || `SKU-${Math.floor(Math.random()*10000)}`,
      status: isLowStock ? 'Low Stock' : 'In Stock',
      rec: rec,
      suggestedQty: rec === 'BUY' ? Math.max(0, p.predicted_demand - p.stock + 20) : (rec === 'HOLD' ? 10 : 0),
      margin: `${Math.floor(Math.random() * 20 + 10)}%`,
      sparkData: rec === 'BUY' ? sparkGreen : (rec === 'REDUCE' ? sparkRed : sparkAmber),
      sparkColor: rec === 'BUY' ? '#10b981' : (rec === 'REDUCE' ? '#f43f5e' : '#f59e0b')
    };
  });

  return (
    <div className="bg-[#f8faff] min-h-screen text-slate-800 p-6 space-y-6 font-sans">
      
      {/* Top Navigation Bar */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products, categories, or SKU..." 
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
             <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-medium">Ctrl K</span>
          </div>
        </div>
      </div>

      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-[#1e1b4b] mb-2 tracking-tight">Products</h1>
          <p className="text-slate-500 text-sm">Explore your products with AI-powered insights, forecasts and recommendations.</p>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Total Products" value={products.length || "1,245"} change="+12% from last month" icon={<Package className="h-5 w-5 text-[#5145cd]" />} iconBg="bg-indigo-100" data={tinyChartData1} color="#5145cd" />
        <KPICard title="Recommended to Buy" value="320" change="+18% from last month" icon={<ShoppingCart className="h-5 w-5 text-emerald-600" />} iconBg="bg-emerald-100" data={tinyChartData2} color="#10b981" />
        <KPICard title="Low Stock" value="48" change="-22% from last month" icon={<AlertTriangle className="h-5 w-5 text-rose-600" />} iconBg="bg-rose-100" data={tinyChartData3} color="#f43f5e" />
        <KPICard title="On Promotion" value="156" change="+8% from last month" icon={<Tag className="h-5 w-5 text-rose-600" />} iconBg="bg-rose-50" data={tinyChartData4} color="#f43f5e" />
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by product name, SKU, or category..." 
            className="w-full border border-slate-200 rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left whitespace-nowrap min-w-[1000px]">
            <thead className="text-[11px] text-slate-500 font-semibold border-b border-slate-100 bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 w-12"><input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Current Stock</th>
                <th className="px-6 py-4 flex items-center gap-1">Predicted Demand <Info className="w-3.5 h-3.5 text-slate-400"/></th>
                <th className="px-6 py-4">Recommendation</th>
                <th className="px-6 py-4">Suggested Qty.</th>
                <th className="px-6 py-4">Expected Margin</th>
                <th className="px-6 py-4 w-32">Trend</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && <tr><td colSpan={10} className="text-center py-10 text-slate-500">Loading products...</td></tr>}
              {!loading && enrichedProducts.map((p, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4"><input type="checkbox" className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" /></td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{p.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">SKU: {p.sku}</div>
                  </td>
                  <td className="px-6 py-4 text-slate-600">{p.category}</td>
                  <td className="px-6 py-4">
                    <div className="font-bold text-slate-800">{p.stock}</div>
                    <div className={`text-[11px] font-medium mt-0.5 ${p.status === 'Low Stock' ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {p.status}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.predicted_demand}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-bold px-3 py-1 rounded-md border ${
                      p.rec === 'BUY' ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 
                      p.rec === 'REDUCE' ? 'border-rose-200 bg-rose-50 text-rose-700' : 
                      'border-amber-200 bg-amber-50 text-amber-700'
                    }`}>
                      {p.rec}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.suggestedQty}</td>
                  <td className="px-6 py-4 font-medium text-slate-700">{p.margin}</td>
                  <td className="px-6 py-4">
                    <div className="w-20 h-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={p.sparkData}>
                          <Line type="monotone" dataKey="v" stroke={p.sparkColor} strokeWidth={2} dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button onClick={() => alert("View options for " + p.name)} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-white">
          <div className="text-xs text-slate-500">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, products.length)} of {products.length} products
          </div>
          <div className="flex items-center gap-1 text-sm font-medium">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-50"
            ><ChevronLeft className="w-4 h-4"/></button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md bg-[#5145cd] text-white">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">3</button>
            <span className="px-2 text-slate-400">...</span>
            <button className="w-8 h-8 flex items-center justify-center rounded-md text-slate-600 hover:bg-slate-100">{totalPages || 1}</button>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 text-slate-500 hover:bg-slate-100 rounded-md disabled:opacity-50"
            ><ChevronRight className="w-4 h-4"/></button>
          </div>
        </div>
      </div>
      
    </div>
  );
}

// Helpers
function KPICard({ title, value, change, icon, iconBg, data, color }: any) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`${iconBg} p-2 rounded-lg`}>{icon}</div>
        <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</h3>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <p className="text-2xl font-black text-slate-800 tracking-tight">{value}</p>
          <p className={`text-xs font-medium mt-1 ${change.includes('-') ? 'text-rose-600' : 'text-emerald-600'}`}>{change}</p>
        </div>
        <div className="w-16 h-8">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <Line type="monotone" dataKey="v" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

function FilterSelect({ label, value }: any) {
  return (
    <div className="flex flex-col">
      <span className="text-[10px] text-slate-500 font-semibold mb-1 ml-1">{label}</span>
      <select className="border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:ring-2 focus:ring-indigo-500 outline-none bg-white min-w-[140px] appearance-none cursor-pointer">
        <option>{value}</option>
      </select>
    </div>
  )
}
