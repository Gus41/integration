import { connectMongo } from "@/lib/mongo";
import Sale from "@/models/sale";

// GET /api/sales
export async function GET() {
  await connectMongo();

  const sales = await Sale.find().sort({ createdAt: -1 });

  return Response.json(sales);
}

// POST /api/sales
export async function POST(req: Request) {
  await connectMongo();

  const body = await req.json();

  // Validate required fields before calling middleware
  if (!body.productCode || !body.quantity) {
    return Response.json(
      { success: false, message: "productCode and quantity are required" },
      { status: 400 }
    );
  }

  // Send sale to middleware for validation and stock update
  let middlewareResponse: Response;
  try {
    middlewareResponse = await fetch("http://integration:8001/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productCode: body.productCode,
        quantity: body.quantity,
      }),
    });
  } catch {
    return Response.json(
      { success: false, message: "Middleware unavailable" },
      { status: 502 }
    );
  }

  const middlewareData = await middlewareResponse.json();
  console.log(middlewareData)

  // Middleware returns { success: false, message } on business rule failures
  if (!middlewareResponse.ok || !middlewareData.success) {
    return Response.json(
      {
        success: false,
        message: middlewareData.message ?? "Middleware validation failed",
      },
      { status: middlewareResponse.ok ? 422 : middlewareResponse.status }
    );
  }

  // Middleware already created the sale record via settings.sales_api,
  // so we just return the sale data it got back from Next.js internally.
  // If the middleware is calling a different Next.js instance (or you want
  // the record returned from this request), you can also persist here:
  const sale = middlewareResponse.sale
  return Response.json(
    {
      success: true,
      sale,
      inventory: middlewareData.inventory,
    },
    { status: 201 }
  );
}