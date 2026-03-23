const API_BASE = "https://cs2team70.cs2410-web01pvm.aston.ac.uk";
const API_ROOT = `${API_BASE}/index.php`;

/* -------------------------------- */
/* Utility to build query strings */
/* -------------------------------- */

const toQuery = (params = {}) => {
  const url = new URL(API_ROOT);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

/* -------------------------------- */
/* Generic request helper */
/* -------------------------------- */

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

/* -------------------------------- */
/* Products */
/* -------------------------------- */

export async function fetchProducts(params = {}) {
  return request("products", params);
}

/* -------------------------------- */
/* Orders */
/* -------------------------------- */

export async function fetchOrders(params = {}) {
  return request("orders", params);
}

/* -------------------------------- */
/* Users */
/* -------------------------------- */

export async function fetchUsers(params = {}) {
  return request("users", params);
}

/* -------------------------------- */
/* Coupons */
/* -------------------------------- */

export async function fetchCouponByCode(code) {
  return request("coupons", { code });
}

/* -------------------------------- */
/* Discount Calculation */
/* -------------------------------- */

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
  }

  if (coupon.discount_type === "fixed") {
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

/* -------------------------------- */
/* Authentication */
/* -------------------------------- */

const jsonRequest = async (action, body = {}) => {
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