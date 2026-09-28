import { supabaseAdmin } from "@/lib/supabase/server";

export default async function CustomersPage() {
  const { data: customers, error } = await supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">Customers</h1>
        <p className="mt-4 text-red-600">
          Failed to load customers: {error.message}
        </p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-5xl p-8">
      <h1 className="text-3xl font-bold">LeadDesk</h1>

      <p className="mt-2 text-gray-600">
        {customers.length} customers
      </p>

      <div className="mt-8 space-y-4">
        {customers.map((customer) => (
          <div
            key={customer.id}
            className="rounded-lg border p-4"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {customer.name}
                </h2>

                <p className="text-sm text-gray-500">
                  {customer.phone}
                </p>
              </div>

              <span className="rounded bg-gray-100 px-2 py-1 text-sm">
                {customer.status}
              </span>
            </div>

            <div className="mt-4 text-sm">
              <p>
                <strong>Source:</strong> {customer.source}
              </p>

              <p className="mt-1">
                <strong>Need:</strong> {customer.need}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}