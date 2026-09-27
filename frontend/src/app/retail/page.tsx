"use client";

import { useState } from "react";
import { getRetailDecision, predictRetailPrice } from "@/lib/api";

type PriceResult = {
  predicted_price_mad: number;
  model?: string;
  model_target?: string;
};

type DecisionResult = {
  predicted_price_mad: number;
  decision: string;
  recommended_quantity: number;
  reason: string;
  price_difference_percentage: number;
  demand_source: string;
};

export default function RetailPage() {
  const [form, setForm] = useState({
    product_id: "TV-55",
    product_name: "Samsung Smart TV 55 4K UHD",
    category: "MULTIMÉDIA",
    brand: "SAMSUNG",
    subcategory: "TV",
    unit: "PIÈCE",
    quantity: "1",
    source_retailer: "Aswak Assalam",
    current_price_mad: 7000,
    current_stock: 30,
    expected_demand: 100,
    safety_stock: 20,
    margin_percentage: 18,
    demand_source: "demo",
  });
  const [priceResult, setPriceResult] = useState<PriceResult | null>(null);
  const [decisionResult, setDecisionResult] = useState<DecisionResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleEstimatePrice() {
    setLoading(true);
    setError("");
    try {
      const res = await predictRetailPrice(form);
      setPriceResult(res);
      setDecisionResult(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleAnalyzeDecision() {
    setLoading(true);
    setError("");
    try {
      const res = await getRetailDecision(form);
      setDecisionResult(res);
      setPriceResult(null);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const textFields = ["product_id", "product_name", "category", "brand", "subcategory", "unit", "quantity", "source_retailer"] as const;
  const numberFields = ["current_price_mad", "current_stock", "expected_demand", "safety_stock", "margin_percentage"] as const;

  const getDecisionColor = (decision: string) => {
    switch (decision) {
      case "BUY": return "bg-emerald-100 text-emerald-800 border-emerald-300";
      case "REDUCE": return "bg-rose-100 text-rose-800 border-rose-300";
      case "HOLD": return "bg-amber-100 text-amber-800 border-amber-300";
      default: return "bg-slate-100 text-slate-800 border-slate-300";
    }
  };

  return (
    <main className="min-h-screen bg-[#f8faff] p-6 text-slate-800">
      <h1 className="text-3xl font-bold text-[#1e1b4b]">Retail Price & Decision</h1>
      <p className="mt-2 text-sm text-slate-600">Estimate a Moroccan retail price and explore an inventory decision using your demand input.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); void handleEstimatePrice(); }}>
          {textFields.map((field) => (
            <label key={field} className="block text-sm font-medium capitalize">
              {field.replaceAll("_", " ")}
              <input className="mt-1 w-full rounded-lg border border-slate-200 p-2" value={form[field]}
                onChange={(event) => setForm({ ...form, [field]: event.target.value })} />
            </label>
          ))}
          {numberFields.map((field) => (
            <label key={field} className="block text-sm font-medium capitalize">
              {field.replaceAll("_", " ")}
              <input type="number" min={field === "margin_percentage" ? undefined : 0} step="any"
                className="mt-1 w-full rounded-lg border border-slate-200 p-2" value={form[field]}
                onChange={(event) => setForm({ ...form, [field]: Number(event.target.value) })} />
            </label>
          ))}
          <label className="block text-sm font-medium">Demand source
            <select className="mt-1 w-full rounded-lg border border-slate-200 p-2" value={form.demand_source}
              onChange={(event) => setForm({ ...form, demand_source: event.target.value })}>
              <option value="demo">Demo input</option>
              <option value="historical">Historical sales</option>
              <option value="demand_model">Demand model</option>
            </select>
          </label>
          <div className="flex flex-wrap gap-3 sm:col-span-2">
            <button disabled={loading} className="rounded-lg bg-[#046c4e] px-4 py-2 text-white disabled:opacity-50" type="submit">Estimate price</button>
            <button disabled={loading} className="rounded-lg bg-slate-800 px-4 py-2 text-white disabled:opacity-50" type="button"
              onClick={() => void handleAnalyzeDecision()}>Analyze decision</button>
          </div>
        </form>

        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm" aria-live="polite">
          <h2 className="text-xl font-bold">Result</h2>
          {loading && <p className="mt-4 text-slate-500">Analyzing...</p>}
          {error && <p className="mt-4 text-red-700">{error}</p>}

          {/* Price Estimation Result */}
          {priceResult && (
            <div className="mt-5 space-y-3">
              <p className="text-sm text-slate-500">Model estimate of observed retail price</p>
              <p className="text-3xl font-bold text-[#046c4e]">{priceResult.predicted_price_mad.toFixed(2)} MAD</p>
              <p className="text-xs text-slate-400 mt-2">
                Price is based on product attributes (name, category, brand, retailer). Changing stock or demand values won't affect this estimate.
              </p>
            </div>
          )}

          {/* Decision Analysis Result */}
          {decisionResult && (
            <div className="mt-5 space-y-4">
              {/* Decision badge */}
              <div className={`inline-block rounded-lg border px-4 py-2 text-lg font-bold ${getDecisionColor(decisionResult.decision)}`}>
                {decisionResult.decision}
              </div>

              {/* Predicted price */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-sm text-slate-500">Model estimated price</p>
                <p className="text-2xl font-bold text-[#046c4e]">{decisionResult.predicted_price_mad.toFixed(2)} MAD</p>
                {decisionResult.price_difference_percentage !== 0 && (
                  <p className="text-sm mt-1">
                    <span className={decisionResult.price_difference_percentage > 0 ? "text-emerald-600" : "text-rose-600"}>
                      {decisionResult.price_difference_percentage > 0 ? "+" : ""}{decisionResult.price_difference_percentage}%
                    </span>
                    <span className="text-slate-400"> vs your current price</span>
                  </p>
                )}
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">Quantity Gap</p>
                  <p className="text-xl font-bold text-slate-800">{decisionResult.recommended_quantity} <span className="text-sm font-normal text-slate-500">units</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-500 font-medium">Demand Source</p>
                  <p className="text-xl font-bold text-slate-800 capitalize">{decisionResult.demand_source}</p>
                </div>
              </div>

              {/* Reason */}
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm font-medium text-blue-800">💡 Reasoning</p>
                <p className="text-sm text-blue-700 mt-1">{decisionResult.reason}</p>
              </div>

              <p className="text-xs text-slate-400">Decision is based on stock ({form.current_stock}), demand ({form.expected_demand}), safety stock ({form.safety_stock}), and margin ({form.margin_percentage}%).</p>
            </div>
          )}

          {/* Empty state */}
          {!loading && !error && !priceResult && !decisionResult && (
            <p className="mt-4 text-sm text-slate-400">Click a button to see results here.</p>
          )}
        </section>
      </div>
    </main>
  );
}
