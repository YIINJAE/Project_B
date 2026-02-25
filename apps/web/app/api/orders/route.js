import { NextResponse } from "next/server";
import { buildMockOrder, validateCreateOrderPayload } from "@/lib/order-api";

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

  var validation = validateCreateOrderPayload(payload);
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
      order: order
    },
    { status: 201 }
  );
}
