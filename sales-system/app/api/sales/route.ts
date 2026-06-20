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

  const sale = await Sale.create({
    ...body,
    total: body.quantity * body.unitPrice,
  });

  return Response.json(sale);
}