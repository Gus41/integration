"use client";

import { useEffect, useState } from "react";

type Sale = {
  _id: string;
  productCode: string;
  quantity: number;
  unitPrice: number;
};

type SaleForm = {
  productCode: string;
  quantity: number;
};

const emptyForm: SaleForm = {
  productCode: "",
  quantity: 1,
};

type Feedback = {
  type: "success" | "error";
  message: string;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default function NewSalePage() {
  const [form, setForm] = useState<SaleForm>(emptyForm);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    setLoading(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/sales");
      if (!res.ok) throw new Error("Failed to load sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to load sales",
      });
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!form.productCode.trim()) {
      setFeedback({ type: "error", message: "Product code is required" });
      return;
    }

    setSubmitting(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setFeedback({
          type: "error",
          message: data.message ?? "Failed to register sale",
        });
        return;
      }

      setFeedback({ type: "success", message: "Sale registered successfully!" });
      setForm(emptyForm);
      await fetchSales();
    } catch (err) {
      setFeedback({
        type: "error",
        message: err instanceof Error ? err.message : "Failed to register sale",
      });
    } finally {
      setSubmitting(false);
    }
  }

  const grandTotal = sales.reduce(
    (acc, s) => acc + s.quantity * s.unitPrice,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
        {/* Header */}
        <div className="mb-10 flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-indigo-500">
            Sales management
          </span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Register a new sale
          </h1>
          <p className="text-sm text-slate-500">
            Fill in the details below to register a new sale and track your records.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          {/* Form card */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
              New entry
            </h2>

            <div className="space-y-5">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Product code
                </label>
                <input
                  value={form.productCode}
                  placeholder="e.g. SKU-1234"
                  onChange={(e) =>
                    setForm({ ...form, productCode: e.target.value })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) =>
                    setForm({ ...form, quantity: Number(e.target.value) })
                  }
                  className="w-full rounded-lg border border-slate-300 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                />
              </div>

              {feedback && (
                <p
                  className={`rounded-lg border px-3.5 py-2.5 text-sm ${
                    feedback.type === "success"
                      ? "border-green-100 bg-green-50 text-green-700"
                      : "border-red-100 bg-red-50 text-red-600"
                  }`}
                >
                  {feedback.message}
                </p>
              )}

              <div className="pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting ? "Saving..." : "Create sale"}
                </button>
              </div>
            </div>
          </div>

          {/* Sales table */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-900">
                Sales history
              </h2>
              {sales.length > 0 && (
                <span className="text-sm text-slate-500">
                  {sales.length} {sales.length === 1 ? "entry" : "entries"} ·{" "}
                  <span className="font-medium text-slate-700">
                    {formatCurrency(grandTotal)}
                  </span>{" "}
                  total
                </span>
              )}
            </div>

            {loading ? (
              <div className="flex items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 shadow-sm shadow-slate-200/60">
                <p className="text-sm text-slate-400">Loading sales...</p>
              </div>
            ) : sales.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-1 rounded-2xl border border-dashed border-slate-300 bg-white py-16 text-center">
                <p className="text-sm font-medium text-slate-600">
                  No sales recorded yet
                </p>
                <p className="text-sm text-slate-400">
                  New entries will show up here.
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-200/60">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Product</th>
                      <th className="px-5 py-3 font-semibold">Qty</th>
                      <th className="px-5 py-3 font-semibold">Unit price</th>
                      <th className="px-5 py-3 font-semibold">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {sales.map((sale) => (
                      <tr
                        key={sale._id}
                        className="text-slate-700 transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          {sale.productCode}
                        </td>
                        <td className="px-5 py-3.5">{sale.quantity}</td>
                        <td className="px-5 py-3.5">
                          {formatCurrency(sale.unitPrice)}
                        </td>
                        <td className="px-5 py-3.5 font-medium text-slate-900">
                          {formatCurrency(sale.quantity * sale.unitPrice)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}