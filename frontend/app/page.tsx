
"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: string | number;
  stock: number;
  createdAt: string;
};

const API_URL =
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:5000/api";

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("0");

  const loadProducts = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/products`);
      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to load products");
      }

      setProducts(result.data);
    } catch {
      setError("Unable to load products. Check that the backend and database are running.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          description: description || undefined,
          price: Number(price),
          stock: Number(stock),
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        const details = result.errors
          ?.map((item: { message: string }) => item.message)
          .join(", ");

        throw new Error(details || result.message || "Failed to create product");
      }

      setProducts((current) => [result.data, ...current]);
      setName("");
      setDescription("");
      setPrice("");
      setStock("0");
      setMessage("Product created successfully!");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Something went wrong"
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-600">
            OrderFlow
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Product Management
          </h1>
          <p className="mt-2 text-slate-600">
            Manage your inventory with Next.js, Express and PostgreSQL.
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[360px_1fr]">
          <section className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="mb-5 text-xl font-semibold">Add a product</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="mb-1 block text-sm font-medium">
                  Product name
                </label>
                <input
                  id="name"
                  required
                  minLength={2}
                  maxLength={100}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Mechanical Keyboard"
                />
              </div>

              <div>
                <label htmlFor="description" className="mb-1 block text-sm font-medium">
                  Description
                </label>
                <textarea
                  id="description"
                  maxLength={500}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Optional product details"
                />
              </div>

              <div>
                <label htmlFor="price" className="mb-1 block text-sm font-medium">
                  Price (LKR)
                </label>
                <input
                  id="price"
                  required
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="12500.00"
                />
              </div>

              <div>
                <label htmlFor="stock" className="mb-1 block text-sm font-medium">
                  Stock quantity
                </label>
                <input
                  id="stock"
                  required
                  type="number"
                  min="0"
                  step="1"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                  className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? "Saving..." : "Create product"}
              </button>
            </form>

            {message && (
              <p role="status" className="mt-4 text-sm text-green-700">
                {message}
              </p>
            )}

            {error && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                {error}
              </p>
            )}
          </section>

          <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold">Inventory</h2>
                <p className="mt-1 text-sm text-slate-500">
                  {products.length} product{products.length === 1 ? "" : "s"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => void loadProducts()}
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <p className="py-10 text-center text-slate-500">
                Loading products...
              </p>
            ) : products.length === 0 ? (
              <p className="rounded-xl bg-slate-50 px-4 py-10 text-center text-slate-500">
                No products yet. Add your first product using the form.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-3 pr-4 font-medium">Product</th>
                      <th className="px-4 py-3 font-medium">Price</th>
                      <th className="px-4 py-3 font-medium">Stock</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id} className="border-b border-slate-100">
                        <td className="py-4 pr-4">
                          <p className="font-medium">{product.name}</p>
                          <p className="mt-1 max-w-xs truncate text-slate-500">
                            {product.description || "No description"}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4">
                          LKR {Number(product.price).toLocaleString("en-LK", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </td>
                        <td className="px-4 py-4">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
