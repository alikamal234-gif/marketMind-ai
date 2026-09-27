"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { getDashboardMetrics, getDemandTrend } from "@/lib/api";
import { 
  Package, ShoppingCart, DollarSign, Percent, 
  TrendingUp, Calendar, Box, Tag, 
  PieChart as PieChartIcon, AlertTriangle, ShieldCheck, CheckCircle2, ChevronRight, Bell, Search, Download
} from "lucide-react";
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from "recharts";

const categoryData = [
  { name: 'Electronics', value: 35, color: '#3b82f6' },
  { name: 'Fashion', value: 22, color: '#8b5cf6' },
  { name: 'Home & Living', value: 18, color: '#10b981' },
  { name: 'Sports', value: 15, color: '#f59e0b' },
  { name: 'Others', value: 10, color: '#f43f5e' },
];

const tinyChartData1 = [{v:10},{v:15},{v:12},{v:20},{v:18},{v:25},{v:22}];
const tinyChartData2 = [{v:15},{v:12},{v:20},{v:18},{v:25},{v:22},{v:30}];
const tinyChartData3 = [{v:20},{v:22},{v:18},{v:25},{v:28},{v:25},{v:35}];
const tinyChartData4 = [{v:10},{v:12},{v:15},{v:14},{v:18},{v:19},{v:22}];

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any>(null);
  const [trendData, setTrendData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const userName = "User";

  useEffect(() => {
    async function fetchData() {
      try {
        const [metricsData, trendRes] = await Promise.all([
          getDashboardMetrics(),
          getDemandTrend()
        ]);
        setMetrics(metricsData);
        setTrendData(trendRes);
      } catch (e) {
        console.error("Failed to load dashboard data", e);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="p-8 flex justify-center items-center h-full text-slate-500">Loading dashboard...</div>;
  if (!metrics) return <div className="p-8 text-red-500 flex justify-center items-center h-full">Failed to load data. Backend offline?</div>;

  return (
    <div className="bg-[#f8faff] min-h-screen text-slate-800 p-6 space-y-6 font-sans">
      
      {/* Top Navigation Bar Simulation */}
      <div className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search products, categories, or insights..." 
            className="w-full bg-slate-50 border-none rounded-lg pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
             <span className="text-[10px] bg-white border border-slate-200 rounded px-1.5 py-0.5 text-slate-400 font-medium">Ctrl K</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 text-sm font-medium text-slate-600">
            <Calendar className="h-4 w-4" />
            Sep 1, 2026 - Sep 30, 2026
          </div>
          <button onClick={() => alert("No new notifications")} className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
          </button>
          <button onClick={() => alert("Report downloaded successfully!")} className="flex items-center gap-2 bg-[#5145cd] hover:bg-[#4237a8] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-md shadow-indigo-200">
            <Download className="h-4 w-4" /> Export Report
          </button>
        </div>
      </div>

      {/* Header */}
      <div className="relative overflow-hidden bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="absolute top-0 right-0 w-[600px] h-full bg-gradient-to-l from-indigo-50 to-transparent opacity-60 pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-[#1e1b4b] mb-2 tracking-tight capitalize">Welcome back, {userName}</h1>
          <p className="text-slate-500 text-sm">Here is your retail performance and AI-powered recommendations.</p>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <KPICard title="Total Products" value={metrics.total_products} change="+12% from last month" icon={<Package className="h-5 w-5 text-blue-600" />} iconBg="bg-blue-100" data={tinyChartData1} color="#3b82f6" />
        <KPICard title="Recommended to Buy" value={metrics.products_at_risk} change="+18% from last month" icon={<ShoppingCart className="h-5 w-5 text-emerald-600" />} iconBg="bg-emerald-100" data={tinyChartData2} color="#10b981" />
        <KPICard title="Estimated Revenue" value={metrics.total_sales} change="+15% from last month" icon={<DollarSign className="h-5 w-5 text-purple-600" />} iconBg="bg-purple-100" data={tinyChartData3} color="#8b5cf6" />
        <KPICard title="Expected Margin" value="23%" change="+3% from last month" icon={<Percent className="h-5 w-5 text-fuchsia-600" />} iconBg="bg-fuchsia-100" data={tinyChartData4} color="#d946ef" />
      </div>

      {/* Middle Row 1 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Chart */}
        <div className="xl:col-span-7 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[340px]">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Sales Trend & Forecast</h3>
              <p className="text-xs text-slate-500 mt-1">Historical sales and predicted demand for selected period.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 bg-[#3b82f6]"></div> Historical Sales</span>
              <span className="flex items-center gap-1.5"><div className="w-3 h-0.5 border-t-2 border-dashed border-[#8b5cf6]"></div> Predicted Demand</span>
              <select onChange={(e) => alert(`Data range updated to: ${e.target.value}`)} className="bg-slate-50 border border-slate-200 rounded-md px-2 py-1 outline-none">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>This Quarter</option>
              </select>
            </div>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPredicted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v/1000}K`} />
                <Tooltip cursor={{stroke: '#e2e8f0', strokeWidth: 2, strokeDasharray: '4 4'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                <Area type="monotone" dataKey="predicted" stroke="#8b5cf6" strokeWidth={2} strokeDasharray="5 5" fillOpacity={1} fill="url(#colorPredicted)" />
                <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="none" activeDot={{ r: 6, fill: '#3b82f6', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Performance */}
        <div className="xl:col-span-3 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[340px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Category Performance</h3>
            <p className="text-xs text-slate-500 mt-1">Sales distribution by product category.</p>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center relative mt-4">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value" stroke="none">
                  {categoryData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[80px] -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-xl font-bold text-slate-800">$124K</span>
              <span className="text-[10px] text-slate-500">Total Sales</span>
            </div>
            
            <div className="w-full mt-4 space-y-2">
              {categoryData.map(cat => (
                <div key={cat.name} className="flex justify-between items-center text-xs">
                  <div className="flex items-center gap-2 text-slate-600 font-medium">
                    <div className="w-2.5 h-2.5 rounded-full" style={{backgroundColor: cat.color}}></div>
                    {cat.name}
                  </div>
                  <div className="text-slate-800 font-semibold">{cat.value}%</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Inventory Status */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[340px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Inventory Status</h3>
            <Link href="/products" className="text-xs text-[#5145cd] font-medium hover:underline shrink-0 ml-2">View all →</Link>
          </div>
          <div className="flex-1 flex flex-col justify-between gap-2">
            <StatusItem icon={<Package className="h-4 w-4 text-emerald-600" />} bg="bg-emerald-50" title="Healthy Stock" value="1,149" />
            <StatusItem icon={<AlertTriangle className="h-4 w-4 text-amber-600" />} bg="bg-amber-50" title="Low Stock" value="48" />
            <StatusItem icon={<Calendar className="h-4 w-4 text-rose-600" />} bg="bg-rose-50" title="Out of Stock" value="12" />
            <StatusItem icon={<Box className="h-4 w-4 text-purple-600" />} bg="bg-purple-50" title="Overstock" value="36" />
          </div>
        </div>
      </div>

      {/* Middle Row 2 */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Model Analysis Grid */}
        <div className="xl:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-800 tracking-tight">Model Analysis</h3>
              <p className="text-xs text-slate-500 mt-1">Outputs from specialized models for the selected product.</p>
            </div>
            <select onChange={(e) => alert(`Analysis timeframe updated to: ${e.target.value}`)} className="bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs outline-none">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1">
            <AnalysisCard icon={<TrendingUp className="text-blue-500" />} bg="bg-blue-50" title="Demand Forecasting" label="Predicted demand" value="150 units" sub="↑ 18%" />
            <AnalysisCard icon={<PieChartIcon className="text-emerald-500" />} bg="bg-emerald-50" title="Sales Trend" label="Recent trend" value="+18%" chart="bar" />
            <AnalysisCard icon={<Calendar className="text-amber-500" />} bg="bg-amber-50" title="Seasonality" label="Seasonal effect" value="High" chart="bar2" />
            <AnalysisCard icon={<Box className="text-purple-500" />} bg="bg-purple-50" title="Inventory Analysis" label="Current stock" value="40 units" sub="Target: 130 units" />
            
            <AnalysisCard icon={<Tag className="text-rose-500" />} bg="bg-rose-50" title="Price & Promotion" label="Price impact" value="+22%" chart="line" />
            <AnalysisCard icon={<DollarSign className="text-amber-500" />} bg="bg-amber-50" title="Profitability" label="Expected margin" value="23%" chart="bar3" />
            <AnalysisCard icon={<AlertTriangle className="text-rose-500" />} bg="bg-rose-50" title="Anomaly Detection" label="Status" value="No anomaly" sub="✓" />
            <AnalysisCard icon={<ShieldCheck className="text-blue-500" />} bg="bg-blue-50" title="Reliability" label="Confidence level" value="87%" chart="progress" />
          </div>
        </div>

        {/* Final Recommendation */}
        <div className="xl:col-span-4 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Final Recommendation</h3>
            <span className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full"><CheckCircle2 className="w-3 h-3"/> High Confidence</span>
          </div>
          
          <div className="bg-[#e0f8ef] rounded-xl p-5 mb-6 flex gap-4">
            <div className="bg-[#10b981] h-12 w-12 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-emerald-200">
              <ShoppingCart className="text-white h-6 w-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-[#047857] leading-none mb-1">BUY</h2>
              <p className="text-[11px] text-[#065f46] font-medium leading-tight">High demand expected with good profitability. Current stock is below predicted demand.</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-6 gap-x-2 mb-8">
            <MetricItem label="Recommended Quantity" value="125 units" />
            <MetricItem label="Expected Demand" value="150 units" />
            <MetricItem label="Current Stock" value="40 units" />
            <MetricItem label="Expected Revenue" value="$13,485" />
            <MetricItem label="Expected Margin" value="23%" />
            <MetricItem label="Risk Level" value={<span className="flex items-center gap-1 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Low</span>} />
          </div>
          
          <div className="mt-auto space-y-3">
            <button onClick={() => alert("Added to Purchase Plan!")} className="w-full bg-[#3b27b4] hover:bg-[#2d1c93] text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-indigo-200 transition-colors">
              <ShoppingCart className="w-4 h-4" /> Add to Purchase Plan
            </button>
            <Link href="/predictions" className="w-full bg-slate-50 hover:bg-slate-100 text-[#3b27b4] font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-200">
              <TrendingUp className="w-4 h-4" /> View Detailed Analysis
            </Link>
          </div>
        </div>
      </div>
      
      {/* Table */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 overflow-x-auto">
        <div className="flex justify-between items-end mb-6 min-w-[700px]">
          <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Top Recommended Products</h3>
            <p className="text-xs text-slate-500 mt-1">Products recommended by the AI models based on current data and analysis.</p>
          </div>
          <Link href="/recommendations" className="text-xs text-[#5145cd] font-medium hover:underline">View all →</Link>
        </div>
        
        <table className="w-full text-sm text-left min-w-[700px]">
          <thead className="text-[11px] text-slate-400 font-semibold border-b border-slate-100">
            <tr>
              <th className="pb-3 font-medium">Product</th>
              <th className="pb-3 font-medium">Category</th>
              <th className="pb-3 font-medium">Current Stock</th>
              <th className="pb-3 font-medium">Predicted Demand</th>
              <th className="pb-3 font-medium">Recommendation</th>
              <th className="pb-3 font-medium">Suggested Qty.</th>
              <th className="pb-3 font-medium">Expected Margin</th>
              <th className="pb-3 font-medium">Confidence</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            <TableRow img="W" name="Wireless Headphones" cat="Electronics" stock="40" demand="150" rec="BUY" qty="125" margin="23%" conf={87} />
            <TableRow img="R" name="Running Shoes" cat="Fashion" stock="200" demand="180" rec="REDUCE" qty="0" margin="12%" conf={72} />
            <TableRow img="B" name="Backpack" cat="Fashion" stock="60" demand="90" rec="BUY" qty="50" margin="28%" conf={85} />
            <TableRow img="M" name='Monitor 24"' cat="Electronics" stock="30" demand="40" rec="HOLD" qty="10" margin="18%" conf={68} />
          </tbody>
        </table>
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
          <p className="text-xs font-medium text-emerald-600 mt-1">{change}</p>
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

function StatusItem({ icon, bg, title, value }: any) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-colors border border-transparent hover:border-slate-100 gap-2">
      <div className="flex items-center gap-3 min-w-0">
        <div className={`${bg} p-2.5 rounded-lg shrink-0`}>{icon}</div>
        <div className="font-semibold text-slate-800 text-sm whitespace-nowrap truncate">{title}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-medium text-slate-500">{value}</span>
        <ChevronRight className="h-4 w-4 text-slate-300" />
      </div>
    </div>
  )
}

function AnalysisCard({ icon, bg, title, label, value, sub, chart }: any) {
  return (
    <div className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col hover:border-slate-300 transition-colors">
      <div className="flex items-center gap-2 mb-3">
        <div className={`${bg} p-1.5 rounded-md`}>
          {React.cloneElement(icon, { className: "w-4 h-4" })}
        </div>
        <h4 className="font-bold text-slate-800 text-xs tracking-tight">{title}</h4>
      </div>
      <div className="mt-auto">
        <p className="text-[10px] text-slate-400 font-semibold uppercase">{label}</p>
        <p className="text-lg font-black text-slate-800 leading-tight">{value}</p>
        
        {sub && <p className={`text-[11px] font-medium mt-1 ${sub === '✓' ? 'text-emerald-600 flex items-center gap-1' : sub.includes('↑') ? 'text-emerald-600' : 'text-slate-500'}`}>
          {sub === '✓' ? <><CheckCircle2 className="w-3 h-3"/> No anomaly</> : sub}
        </p>}
        
        {chart === 'bar' && (
          <div className="flex items-end gap-0.5 h-4 mt-2">
            {[2,4,3,5,4,6,8,7,9].map((h,i) => <div key={i} className="w-1.5 bg-emerald-400 rounded-t-sm" style={{height: `${h*10}%`}}></div>)}
          </div>
        )}
        {chart === 'bar2' && (
          <div className="flex items-end gap-0.5 h-4 mt-2">
            {[1,2,3,4,6,8,7,6,5].map((h,i) => <div key={i} className="w-1.5 bg-amber-400 rounded-t-sm" style={{height: `${h*10}%`}}></div>)}
          </div>
        )}
        {chart === 'bar3' && (
          <div className="flex items-end gap-0.5 h-4 mt-2">
            {[4,4,5,5,6,7,8,9,8].map((h,i) => <div key={i} className="w-1.5 bg-amber-400 rounded-t-sm" style={{height: `${h*10}%`}}></div>)}
          </div>
        )}
        {chart === 'line' && (
          <div className="w-full h-4 mt-2 border-b-2 border-dashed border-rose-300 relative">
             <div className="absolute w-full h-0.5 bg-rose-500 bottom-0 origin-bottom-left -rotate-[10deg]"></div>
          </div>
        )}
        {chart === 'progress' && (
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-blue-600 w-[87%] rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  )
}

function MetricItem({ label, value }: any) {
  return (
    <div>
      <p className="text-[10px] text-slate-500 font-semibold mb-0.5">{label}</p>
      <div className="text-sm font-bold text-slate-800">{value}</div>
    </div>
  )
}

function TableRow({ img, name, cat, stock, demand, rec, qty, margin, conf }: any) {
  const getBadge = (r: string) => {
    if (r === 'BUY') return <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700">BUY</span>;
    if (r === 'REDUCE') return <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-rose-200 bg-rose-50 text-rose-700">REDUCE</span>;
    return <span className="text-[10px] font-bold px-2 py-0.5 rounded border border-amber-200 bg-amber-50 text-amber-700">HOLD</span>;
  }
  
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="py-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-lg shadow-sm border border-slate-200">{img}</div>
          <span className="font-bold text-slate-800">{name}</span>
        </div>
      </td>
      <td className="py-3 text-slate-500">{cat}</td>
      <td className="py-3 font-medium text-slate-700">{stock}</td>
      <td className="py-3 font-medium text-slate-700">{demand}</td>
      <td className="py-3">{getBadge(rec)}</td>
      <td className="py-3 font-medium text-slate-700">{qty}</td>
      <td className="py-3 font-medium text-slate-700">{margin}</td>
      <td className="py-3">
        <div className="flex items-center gap-2">
          <div className="w-16 h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{width: `${conf}%`}}></div>
          </div>
          <span className="text-xs font-semibold text-slate-600">{conf}%</span>
        </div>
      </td>
      <td className="py-3 text-right">
        <ChevronRight className="h-4 w-4 text-slate-300 ml-auto" />
      </td>
    </tr>
  )
}
