// client.js — обёртка над fetch с базовым URL бэкенда
const BASE_URL = "http://127.0.0.1:8000";

export async function apiGet(path, params = {}) {
  const url = new URL(BASE_URL + path);

  Object.entries(params).forEach(([key, value]) => {
    if (value === null || value === undefined) return;
    if (Array.isArray(value)) {
      value.forEach((v) => url.searchParams.append(key, v));
    } else {
      url.searchParams.append(key, value);
    }
  });

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { "Accept": "application/json" },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  return res.json();
}