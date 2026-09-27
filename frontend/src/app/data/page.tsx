"use client";

import { useState } from "react";
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle } from "lucide-react";

export default function DataUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus("idle");
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    setStatus("idle");
    
    try {
      const text = await file.text();
      const lines = text.split('\n').filter(l => l.trim() !== '');
      if (lines.length < 2) {
        throw new Error("File must contain headers and at least one row of data");
      }
      
      const headers = lines[0].split(',').map(h => h.trim());
      const data = lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
          obj[header] = values[i]?.trim();
          return obj;
        }, {} as any);
      });

      // We dynamically imported uploadProducts but need it from api.ts
      const { uploadProducts } = await import('@/lib/api');
      const response = await uploadProducts(data);
      
      setStatus("success");
      setMessage(`Successfully processed and imported ${response.inserted || data.length} products to your inventory!`);
      setFile(null);
    } catch (err: any) {
      setStatus("error");
      setMessage(err.message || "An error occurred while uploading data.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Data</h1>
        <p className="text-slate-500 mt-2">Upload your monthly sales and stock data to fuel the AI Decision Engine.</p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-50 mb-4">
              <FileSpreadsheet className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900">Upload Monthly Data</h2>
            <p className="text-sm text-slate-500 mt-2">
              Upload a CSV or Excel file containing your current stock levels, recent sales, and prices.
            </p>
          </div>

          <div 
            className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
              file ? "border-blue-500 bg-blue-50" : "border-slate-300 hover:border-slate-400 bg-slate-50"
            }`}
          >
            <input 
              type="file" 
              id="file-upload" 
              className="hidden" 
              accept=".csv, .xlsx, .xls"
              onChange={handleFileChange}
            />
            <label 
              htmlFor="file-upload" 
              className="cursor-pointer flex flex-col items-center justify-center w-full h-full"
            >
              {file ? (
                <>
                  <FileSpreadsheet className="h-10 w-10 text-blue-500 mb-3" />
                  <span className="font-medium text-slate-900">{file.name}</span>
                  <span className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024).toFixed(2)} KB
                  </span>
                  <span className="text-sm text-blue-600 font-medium mt-4">Click to select a different file</span>
                </>
              ) : (
                <>
                  <Upload className="h-10 w-10 text-slate-400 mb-3" />
                  <span className="font-medium text-slate-900">Click to browse files</span>
                  <span className="text-xs text-slate-500 mt-1">Supports CSV and Excel</span>
                </>
              )}
            </label>
          </div>

          {status === "success" && (
            <div className="mt-6 p-4 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg flex items-start gap-3">
              <CheckCircle className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          {status === "error" && (
            <div className="mt-6 p-4 bg-red-50 text-red-700 border border-red-200 rounded-lg flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
              <p className="text-sm font-medium">{message}</p>
            </div>
          )}

          <div className="mt-8">
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
            >
              {uploading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Data...
                </span>
              ) : "Upload Data to AI"}
            </button>
          </div>
        </div>
      </div>
      
      <div className="bg-slate-900 rounded-2xl p-6 text-slate-300 shadow-lg">
        <h3 className="font-semibold text-white mb-2">How it works</h3>
        <p className="text-sm leading-relaxed mb-4">
          MarketMind AI uses this data to update your current inventory context. 
          When you go to the <strong>Decision Engine</strong> page, the AI will evaluate your latest uploaded stock levels against its trained XGBoost demand models to generate precise buying recommendations.
        </p>
      </div>
    </div>
  );
}
