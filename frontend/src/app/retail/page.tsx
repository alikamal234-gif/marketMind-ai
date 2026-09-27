"use client";

import { useState } from "react";
import { getRetailDecision, predictRetailPrice } from "@/lib/api";

type Result = {
  predicted_price_mad: number;
  decision?: string;
  recommended_quantity?: number;
  reason?: string;
  demand_source?: string;
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
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(decision: boolean) {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      setResult(await (decision ? getRetailDecision(form) : predictRetailPrice(form)));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  const textFields = ["product_id", "product_name", "category", "brand", "subcategory", "unit", "quantity", "source_retailer"] as const;
  const numberFields = ["current_price_mad", "current_stock", "expected_demand", "safety_stock", "margin_percentage"] as const;

  return (
    <main className="min-h-screen bg-[#f8faff] p-6 text-slate-800">
      <h1 className="text-3xl font-bold text-[#1e1b4b]">Retail Price & Decision</h1>
      <p className="mt-2 text-sm text-slate-600">Estimate a Moroccan retail price and explore an inventory decision using your demand input.</p>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <form className="grid gap-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:grid-cols-2" onSubmit={(event) => { event.preventDefault(); void submit(false); }}>
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
              onClick={() => void submit(true)}>Analyze decision</button>
          </div>
        </form>
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm" aria-live="polite">
          <h2 className="text-xl font-bold">Result</h2>
          {loading && <p className="mt-4">Analyzing...</p>}
          {error && <p className="mt-4 text-red-700">{error}</p>}
          {result && <div className="mt-5 space-y-3">
            <p className="text-sm text-slate-500">Model estimate of observed retail price</p>
            <p className="text-3xl font-bold text-[#046c4e]">{result.predicted_price_mad.toFixed(2)} MAD</p>
            {result.decision && <>
              <p><strong>Decision:</strong> {result.decision}</p>
              <p><strong>Quantity gap:</strong> {result.recommended_quantity} units</p>
              <p>{result.reason}</p>
              <p className="text-xs text-slate-500">Demand source: {result.demand_source}. Decision rules are a demo heuristic.</p>
            </>}
          </div>}
        </section>
      </div>
    </main>
  );
}
