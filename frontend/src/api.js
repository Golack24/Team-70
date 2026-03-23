const API_BASE = "https://cs2team70.cs2410-web01pvm.aston.ac.uk";
const API_ROOT = `${API_BASE}/index.php`;

/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */

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
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

async function sendJson(resource, method, body = {}, params = {}) {
  const url = toQuery({ resource, ...params });

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
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
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

/* ----------------------------- */
/* Products                      */
/* ----------------------------- */

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

/* ----------------------------- */
/* Users                         */
/* ----------------------------- */

export async function fetchUsers(params = {}) {
  return request("users", params);
}

export async function updateUser(id, payload) {
  return sendJson("users", "PUT", payload, { id });
}

export async function deleteUser(id) {
  return sendNoBody("users", "DELETE", { id });
}

/* ----------------------------- */
/* Orders                        */
/* ----------------------------- */

export async function fetchOrders(params = {}) {
  return request("orders", params);
}

export async function createOrder(payload) {
  return sendJson("orders", "POST", payload);
}

export async function updateOrder(id, payload) {
  return sendJson("orders", "PUT", payload, { id });
}

export async function deleteOrder(id) {
  return sendNoBody("orders", "DELETE", { id });
}

/* ----------------------------- */
/* Addresses                     */
/* ----------------------------- */

export async function fetchAddresses(params = {}) {
  return request("addresses", params);
}

export async function createAddress(payload) {
  return sendJson("addresses", "POST", payload);
}

export async function updateAddress(id, payload) {
  return sendJson("addresses", "PUT", payload, { id });
}

export async function deleteAddress(id) {
  return sendNoBody("addresses", "DELETE", { id });
}

/* ----------------------------- */
/* Basket                        */
/* ----------------------------- */

export async function fetchBasket(params = {}) {
  return request("basket", params);
}

export async function addToBasket(payload) {
  return sendJson("basket", "POST", payload);
}

export async function updateBasketItem(id, payload) {
  return sendJson("basket", "PUT", payload, { id });
}

export async function deleteBasketItem(id) {
  return sendNoBody("basket", "DELETE", { id });
}

export async function clearBasket() {
  return sendNoBody("basket", "DELETE");
}

/* ----------------------------- */
/* Coupons / Discounts           */
/* ----------------------------- */

export async function fetchCouponByCode(code) {
  return request("coupons", { code });
}

export function calculateDiscount(coupon, subtotal) {
  if (!coupon) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "Invalid coupon",
    };
  }

  if (Number(coupon.is_active) !== 1) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: "This coupon is inactive",
    };
  }

  const minOrderValue = Number(coupon.min_order_value || 0);

  if (subtotal < minOrderValue) {
    return {
      valid: false,
      discountAmount: 0,
      finalTotal: subtotal,
      message: `Minimum order is £${minOrderValue.toFixed(2)}`,
    };
  }

  let discountAmount = 0;

  if (coupon.discount_type === "percentage") {
    discountAmount =
      subtotal * (Number(coupon.discount_value || 0) / 100);
  } else if (coupon.discount_type === "fixed") {
    discountAmount = Number(coupon.discount_value || 0);
  }

  discountAmount = Math.min(discountAmount, subtotal);

  return {
    valid: true,
    discountAmount,
    finalTotal: subtotal - discountAmount,
    message: `${coupon.code || coupon.CODE} applied`,
  };
}

/* ----------------------------- */
/* Authentication                */
/* ----------------------------- */

async function jsonRequest(action, body = {}) {
  const res = await fetch(`${API_ROOT}?resource=users&action=${action}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Request failed (${res.status})`);
  }

  return data;
}

export async function registerUser(payload) {
  return jsonRequest("register", payload);
}

export async function loginUser(payload) {
  return jsonRequest("login", payload);
}

export async function logoutUser() {
  return jsonRequest("logout", {});
}

export async function resetPasswordUser(payload) {
  return jsonRequest("reset_password", payload);
}
