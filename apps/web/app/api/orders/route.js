export async function POST(request) {
  try {
    var payload = await request.json();
    var contact = payload?.contact || {};
    var address = payload?.address || {};
    var items = Array.isArray(payload?.items) ? payload.items : [];

    if (!contact.name || !contact.phone || !contact.email) {
      return Response.json(
        { message: "Missing required contact fields." },
        { status: 400 }
      );
    }

    if (!address.zipCode || !address.address1) {
      return Response.json(
        { message: "Missing required address fields." },
        { status: 400 }
      );
    }

    var subtotal = items.reduce(function (sum, item) {
      var qty = Number(item?.qty) || 0;
      var unitPrice = Number(item?.unitPrice) || 0;
      return sum + qty * unitPrice;
    }, 0);

    var orderId = "MOCK-" + String(Date.now());

    return Response.json(
      {
        ok: true,
        orderId: orderId,
        itemCount: items.length,
        subtotal: subtotal
      },
      { status: 201 }
    );
  } catch (_error) {
    return Response.json(
      { message: "Invalid request payload." },
      { status: 400 }
    );
  }
}
