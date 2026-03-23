const API_BASE = "https://cs2team70.cs2410-web01pvm.aston.ac.uk";
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
  const res = await fetch(url, {
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

async function sendJson(resource, method, body = {}, params = {}) {
  const url = toQuery({ resource, ...params });
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

async function sendNoBody(resource, method, params = {}) {
  const url = toQuery({ resource, ...params });
  const res = await fetch(url, {
    method,
    credentials: "include",
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.error || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data;
}

// PRODUCTS
export async function fetchProducts(params = {}) {
  return request("products", params);
}

export async function createProduct(payload) {
  return sendJson("products", "POST", payload);
}

export async function updateProduct(id, payload) {
  return sendJson("products", "PUT", payload, { id });
}

export async function deleteProduct(id) {
  return sendNoBody("products", "DELETE", { id });
}

// USERS / CUSTOMERS
export async function fetchUsers(params = {}) {
  return request("users", params);
}

export async function updateUser(id, payload) {
  return sendJson("users", "PUT", payload, { id });
}

export async function deleteUser(id) {
  return sendNoBody("users", "DELETE", { id });
}

// ORDERS
export async function fetchOrders(params = {}) {
  return request("orders", params);
}

export async function updateOrder(id, payload) {
  return sendJson("orders", "PUT", payload, { id });
}

export async function deleteOrder(id) {
  return sendNoBody("orders", "DELETE", { id });
}

// Auth helpers
const jsonRequest = async (action, body = {}) => {
  const res = await fetch(`${API_ROOT}?resource=users&action=${action}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
  return jsonRequest("logout", {});
}