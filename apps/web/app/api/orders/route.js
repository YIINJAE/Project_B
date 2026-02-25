import { NextResponse } from "next/server";
import { buildMockOrder, validateCreateOrderPayload } from "@/lib/order-api";

function normalizeLegacyCheckoutPayload(payload) {
  var contact = payload?.contact || {};
  var address = payload?.address || {};
  var items = Array.isArray(payload?.items) ? payload.items : [];

  return {
    customer: {
      name: contact.name || "",
      email: contact.email || "",
      phone: contact.phone || ""
    },
    shipping: {
      recipient: contact.name || "",
      address1: address.address1 || "",
      address2: address.address2 || "",
      city: address.city || "Seoul",
      postalCode: address.zipCode || "",
      country: address.country || "KR",
      phone: contact.phone || ""
    },
    items: items.map(function (item) {
      var slug = item?.slug || item?.productId || "";
      var size = item?.size || "ONE";
      var color = item?.color || "DEFAULT";
      var quantity = Number(item?.qty || item?.quantity || 0);
      return {
        productId: slug,
        sku: slug + "-" + size + "-" + color,
        quantity: Number.isInteger(quantity) && quantity > 0 ? quantity : 1
      };
    })
  };
}

function normalizePayload(payload) {
  if (payload?.customer && payload?.shipping) {
    return payload;
  }
  return normalizeLegacyCheckoutPayload(payload);
}

export async function POST(request) {
  var payload;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_JSON",
          message: "Request body must be valid JSON"
        }
      },
      { status: 400 }
    );
  }

  var normalized = normalizePayload(payload);
  var validation = validateCreateOrderPayload(normalized);
  if (!validation.isValid) {
    return NextResponse.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "Invalid order payload",
          details: validation.errors
        }
      },
      { status: 422 }
    );
  }

  var order = buildMockOrder(validation.value);

  return NextResponse.json(
    {
      ok: true,
      orderId: order.id,
      order: order
    },
    { status: 201 }
  );
}
