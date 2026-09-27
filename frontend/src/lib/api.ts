const API_BASE_URL = "http://localhost:8001/api";

export async function getDashboardMetrics() {
  const res = await fetch(`${API_BASE_URL}/dashboard/metrics`);
  if (!res.ok) throw new Error("Failed to fetch dashboard metrics");
  return res.json();
}

export async function getDemandTrend() {
  const res = await fetch(`${API_BASE_URL}/dashboard/trend`);
  if (!res.ok) throw new Error("Failed to fetch demand trend");
  return res.json();
}

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products/`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function addProduct(data: any) {
  const res = await fetch(`${API_BASE_URL}/products/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add product");
  return res.json();
}

export async function uploadProducts(data: any[]) {
  const res = await fetch(`${API_BASE_URL}/products/bulk`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to upload products");
  return res.json();
}

export async function getInsights() {
  const res = await fetch(`${API_BASE_URL}/insights/`);
  if (!res.ok) throw new Error("Failed to fetch insights");
  return res.json();
}

export async function predictDemand(data: any) {
  const res = await fetch(`${API_BASE_URL}/predictions/demand`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate prediction");
  return res.json();
}

export async function predictRetailPrice(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/retail/price`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Price estimate failed (${res.status})`);
  return res.json();
}

export async function getRetailDecision(data: Record<string, unknown>) {
  const res = await fetch(`${API_BASE_URL}/retail/decision`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(`Retail decision failed (${res.status})`);
  return res.json();
}

export async function askAssistant(message: string, context: any) {
  const res = await fetch(`${API_BASE_URL}/assistant/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, context }),
  });
  if (!res.ok) throw new Error("Failed to get assistant response");
  return res.json();
}

export async function generateRecommendations(data: any[]) {
  const res = await fetch(`${API_BASE_URL}/recommendations/generate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to generate recommendations");
  return res.json();
}
