import { connectMongo } from "@/lib/mongo";
import Sale from "@/models/sale";

//this route sould only be called by the middleware
export async function POST(req: Request) {
  await connectMongo();

  const body = await req.json();

  const sale = await Sale.create({
    ...body,
    total: body.quantity * body.unitPrice,
  });

  return Response.json(sale);
}