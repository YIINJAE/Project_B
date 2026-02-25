import { ORDER_INITIAL_STATE } from "@/lib/order-state";

function createOrderId() {
  return "ord_" + Date.now().toString(36);
}

export async function POST(request) {
  let body;

  try {
    body = await request.json();
  } catch (_error) {
    return Response.json(
      {
        error: {
          code: "INVALID_INPUT",
          message: "Request body must be valid JSON"
        }
      },
      { status: 400 }
    );
  }

  const order = {
    id: createOrderId(),
    status: ORDER_INITIAL_STATE,
    shipping_address: body?.shipping_address || null,
    payment_method: body?.payment_method || null,
    notes: body?.notes || "",
    created_at: new Date().toISOString()
  };

  return Response.json(order, { status: 201 });
}
