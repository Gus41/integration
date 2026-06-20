import { connectMongo } from "@/lib/mongo";
import Sale from "@/models/sale";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: Request, { params }: RouteContext) {
  const { id } = await params;

  await connectMongo();

  const sale = await Sale.findById(id);

  if (!sale) {
    return Response.json({ error: "Sale not found" }, { status: 404 });
  }

  return Response.json(sale);
}

export async function PUT(req: Request, { params }: RouteContext) {
  const { id } = await params;
  const body = await req.json();

  await connectMongo();

  const updated = await Sale.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!updated) {
    return Response.json({ error: "Sale not found" }, { status: 404 });
  }

  return Response.json(updated);
}

export async function DELETE(req: Request, { params }: RouteContext) {
  const { id } = await params;

  await connectMongo();

  const deleted = await Sale.findByIdAndDelete(id);

  if (!deleted) {
    return Response.json({ error: "Sale not found" }, { status: 404 });
  }

  return Response.json({ message: "Deleted successfully" });
}