import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase/server";

const statuses = [
  "new",
  "contacted",
  "interested",
  "won",
  "lost",
];

function getStatusStyle(status: string) {
  switch (status) {
    case "new":
      return "bg-gray-200 text-gray-900";
    case "contacted":
      return "bg-blue-100 text-blue-800";
    case "interested":
      return "bg-yellow-100 text-yellow-800";
    case "won":
      return "bg-green-100 text-green-800";
    case "lost":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-200 text-gray-900";
  }
}

type CustomersPageProps = {
  searchParams: Promise<{
    status?: string;
  }>;
};

export default async function CustomersPage({
  searchParams,
}: CustomersPageProps) {
  const { status } = await searchParams;

  const selectedStatus =
    status && statuses.includes(status)
      ? status
      : null;

  let customerQuery = supabaseAdmin
    .from("customers")
    .select("*")
    .order("created_at", { ascending: false });

  if (selectedStatus) {
    customerQuery = customerQuery.eq(
      "status",
      selectedStatus
    );
  }

  const [
    { data: customers, error },
    { data: statusRows },
  ] = await Promise.all([
    customerQuery,
    supabaseAdmin.from("customers").select("status"),
  ]);

  if (error) {
    return (
      <main className="p-8">
        <h1 className="text-2xl font-bold">
          Customers
        </h1>

        <p className="mt-4 text-red-600">
          Failed to load customers: {error.message}
        </p>
      </main>
    );
  }

  const counts = {
    all: statusRows?.length ?? 0,
    new: 0,
    contacted: 0,
    interested: 0,
    won: 0,
    lost: 0,
  };

  statusRows?.forEach((row) => {
    const key = row.status as keyof typeof counts;

    if (key in counts) {
      counts[key]++;
    }
  });

  return (
    <main className="mx-auto max-w-5xl p-8">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-4xl font-bold">
            LeadDesk
          </h1>

          <p className="mt-2 text-gray-500">
            {counts.all} customers
          </p>
        </div>

        <Link
          href="/customers/new"
          className="rounded-lg bg-white px-5 py-3 font-medium text-black"
        >
          + Add Customer
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        <Link
          href="/customers"
          className={`rounded-lg px-4 py-2 text-sm ${
            !selectedStatus
              ? "bg-white text-black"
              : "bg-gray-900 text-gray-300"
          }`}
        >
          All {counts.all}
        </Link>

        {statuses.map((item) => (
          <Link
            key={item}
            href={`/customers?status=${item}`}
            className={`rounded-lg px-4 py-2 text-sm ${
              selectedStatus === item
                ? "bg-white text-black"
                : "bg-gray-900 text-gray-300"
            }`}
          >
            {item} {counts[item as keyof typeof counts]}
          </Link>
        ))}
      </div>

      <div className="mt-8 space-y-4">
        {customers?.length === 0 ? (
          <p className="text-gray-500">
            No customers in this stage.
          </p>
        ) : (
          customers?.map((customer) => (
            <Link
              key={customer.id}
              href={`/customers/${customer.id}`}
              className="block rounded-lg border p-5 transition hover:bg-gray-900"
            >
              <div className="flex items-start justify-between gap-6">
                <div>
                  <h2 className="text-xl font-semibold">
                    {customer.name}
                  </h2>

                  <p className="mt-1 text-gray-500">
                    {customer.phone || "No phone"}
                  </p>
                </div>

                <span
                  className={`rounded px-3 py-1 text-sm font-medium ${getStatusStyle(
                    customer.status
                  )}`}
                >
                  {customer.status}
                </span>
              </div>

              <div className="mt-5 space-y-2 text-sm">
                <p>
                  <strong>Source:</strong>{" "}
                  {customer.source}
                </p>

                <p>
                  <strong>Need:</strong>{" "}
                  {customer.need ||
                    "No need recorded"}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </main>
  );
}