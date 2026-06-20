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
  unitPrice: number;
};

const emptyForm: SaleForm = {
  productCode: "",
  quantity: 1,
  unitPrice: 0,
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = editingId !== null;

  useEffect(() => {
    fetchSales();
  }, []);

  async function fetchSales() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/sales");
      if (!res.ok) throw new Error("Failed to load sales");
      const data = await res.json();
      setSales(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load sales");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit() {
    if (!form.productCode.trim()) {
      setError("Product code is required");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch(
        isEditing ? `/api/sales/${editingId}` : "/api/sales",
        {
          method: isEditing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) throw new Error("Failed to save sale");

      resetForm();
      await fetchSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save sale");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id: string) {
    setError(null);
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete sale");

      if (editingId === id) resetForm();
      await fetchSales();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete sale");
    }
  }

  function handleEdit(sale: Sale) {
    setEditingId(sale._id);
    setForm({
      productCode: sale.productCode,
      quantity: sale.quantity,
      unitPrice: sale.unitPrice,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  const total = form.quantity * form.unitPrice;
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
            {isEditing ? "Edit sale" : "Register a new sale"}
          </h1>
          <p className="text-sm text-slate-500">
            {isEditing
              ? "Update the details below and save your changes."
              : "Fill in the details below to register a new sale and track your records."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[380px_1fr]">
          {/* Form card */}
          <div className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/60">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wide text-slate-400">
              {isEditing ? "Editing entry" : "New entry"}
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

              <div className="grid grid-cols-2 gap-4">
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

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-slate-700">
                    Unit price
                  </label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={form.unitPrice}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          unitPrice: Number(e.target.value),
                        })
                      }
                      className="w-full rounded-lg border border-slate-300 bg-slate-50/50 py-2.5 pl-7 pr-3.5 text-sm text-slate-900 transition focus:border-indigo-400 focus:bg-white focus:outline-none focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-indigo-50/70 px-4 py-3 text-sm">
                <span className="font-medium text-indigo-700">Total</span>
                <span className="text-base font-semibold text-indigo-900">
                  {formatCurrency(total)}
                </span>
              </div>

              {error && (
                <p className="rounded-lg border border-red-100 bg-red-50 px-3.5 py-2.5 text-sm text-red-600">
                  {error}
                </p>
              )}

              <div className="flex gap-3 pt-1">
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="inline-flex flex-1 items-center justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 active:bg-indigo-800 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {submitting
                    ? "Saving..."
                    : isEditing
                    ? "Save changes"
                    : "Create sale"}
                </button>

                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                )}
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
                      <th className="px-5 py-3 text-right font-semibold">
                        Actions
                      </th>
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
                        <td className="px-5 py-3.5">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(sale)}
                              className="rounded-md px-2.5 py-1 text-sm font-medium text-indigo-600 transition hover:bg-indigo-50"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(sale._id)}
                              className="rounded-md px-2.5 py-1 text-sm font-medium text-red-500 transition hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
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