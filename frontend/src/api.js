const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8000").replace(/\/$/, "");
const API_ROOT = `${API_BASE}/index.php`;

const toQuery = (params = {}) => {
  const url = new URL(API_ROOT);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });
  return url.toString();
};

async function request(resource, params = {}) {
  const url = toQuery({ resource, ...params });
  const res = await fetch(url);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

export async function fetchProducts(params = {}) {
  return request("products", params);
}

// Auth helpers
const jsonRequest = async (action, body = {}) => {
  const res = await fetch(`${API_ROOT}?resource=users&action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
};

export async function registerUser(payload) {
  return jsonRequest("register", payload);
}

export async function loginUser(payload) {
  return jsonRequest("login", payload);
}

export async function logoutUser() {
  // backend expects POST logout
  return jsonRequest("logout", {});
}
