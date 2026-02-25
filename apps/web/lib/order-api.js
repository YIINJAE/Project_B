export var ORDER_STATE_MACHINE = {
  pending_payment: ["paid", "cancelled"],
  paid: ["preparing_shipment", "cancelled"],
  preparing_shipment: ["shipped", "cancelled"],
  shipped: ["delivered"],
  delivered: [],
  cancelled: []
};

export var INITIAL_ORDER_STATUS = "pending_payment";

function isPlainObject(value) {
  return value !== null && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeItems(items, errors) {
  if (!Array.isArray(items) || items.length === 0) {
    errors.push({ field: "items", reason: "must be a non-empty array" });
    return [];
  }

  return items
    .map(function (item, index) {
      if (!isPlainObject(item)) {
        errors.push({ field: "items[" + index + "]", reason: "must be an object" });
        return null;
      }

      var productId = item.productId;
      var sku = item.sku;
      var quantity = item.quantity;

      if (!isNonEmptyString(productId)) {
        errors.push({ field: "items[" + index + "].productId", reason: "is required" });
      }
      if (!isNonEmptyString(sku)) {
        errors.push({ field: "items[" + index + "].sku", reason: "is required" });
      }
      if (!Number.isInteger(quantity) || quantity < 1) {
        errors.push({ field: "items[" + index + "].quantity", reason: "must be an integer >= 1" });
      }

      if (!isNonEmptyString(productId) || !isNonEmptyString(sku) || !Number.isInteger(quantity) || quantity < 1) {
        return null;
      }

      return {
        productId: productId.trim(),
        sku: sku.trim(),
        quantity: quantity
      };
    })
    .filter(Boolean);
}

function normalizeCustomer(customer, errors) {
  if (!isPlainObject(customer)) {
    errors.push({ field: "customer", reason: "must be an object" });
    return null;
  }

  var name = customer.name;
  var email = customer.email;
  var phone = customer.phone;

  if (!isNonEmptyString(name)) {
    errors.push({ field: "customer.name", reason: "is required" });
  }
  if (!isNonEmptyString(email) || !email.includes("@")) {
    errors.push({ field: "customer.email", reason: "must be a valid email" });
  }
  if (phone !== undefined && !isNonEmptyString(phone)) {
    errors.push({ field: "customer.phone", reason: "must be a non-empty string when provided" });
  }

  if (!isNonEmptyString(name) || !isNonEmptyString(email) || !email.includes("@")) {
    return null;
  }

  return {
    name: name.trim(),
    email: email.trim().toLowerCase(),
    phone: isNonEmptyString(phone) ? phone.trim() : null
  };
}

function normalizeShipping(shipping, errors) {
  if (!isPlainObject(shipping)) {
    errors.push({ field: "shipping", reason: "must be an object" });
    return null;
  }

  var requiredFields = ["recipient", "address1", "city", "postalCode", "country"];
  var normalized = {};

  requiredFields.forEach(function (field) {
    if (!isNonEmptyString(shipping[field])) {
      errors.push({ field: "shipping." + field, reason: "is required" });
      return;
    }
    normalized[field] = shipping[field].trim();
  });

  normalized.address2 = isNonEmptyString(shipping.address2) ? shipping.address2.trim() : null;

  if (shipping.phone !== undefined && !isNonEmptyString(shipping.phone)) {
    errors.push({ field: "shipping.phone", reason: "must be a non-empty string when provided" });
  }

  normalized.phone = isNonEmptyString(shipping.phone) ? shipping.phone.trim() : null;

  return requiredFields.every(function (field) {
    return isNonEmptyString(normalized[field]);
  })
    ? normalized
    : null;
}

function generateOrderId() {
  return "ord_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 8);
}

export function validateCreateOrderPayload(payload) {
  var errors = [];

  if (!isPlainObject(payload)) {
    return {
      isValid: false,
      errors: [{ field: "body", reason: "must be a JSON object" }],
      value: null
    };
  }

  var items = normalizeItems(payload.items, errors);
  var customer = normalizeCustomer(payload.customer, errors);
  var shipping = normalizeShipping(payload.shipping, errors);

  if (errors.length > 0) {
    return {
      isValid: false,
      errors: errors,
      value: null
    };
  }

  return {
    isValid: true,
    errors: [],
    value: {
      items: items,
      customer: customer,
      shipping: shipping
    }
  };
}

export function buildMockOrder(validatedPayload) {
  var createdAt = new Date().toISOString();

  return {
    id: generateOrderId(),
    status: INITIAL_ORDER_STATUS,
    createdAt: createdAt,
    items: validatedPayload.items,
    customer: validatedPayload.customer,
    shipping: validatedPayload.shipping
  };
}
