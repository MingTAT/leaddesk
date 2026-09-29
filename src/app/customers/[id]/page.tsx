import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CustomerPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  const { data: customer, error: customerError } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

  if (customerError || !customer) {
    notFound();
  }

  const { data: interactions, error: interactionError } =
    await supabaseAdmin
      .from("interactions")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", { ascending: false });

  if (interactionError) {
    throw new Error(
      `Failed to load interactions: ${interactionError.message}`
    );
  }

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link
        href="/customers"
        className="text-sm text-gray-500 hover:text-gray-300"
      >
        ← Back to customers
      </Link>

      <div className="mt-6 rounded-lg border p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              {customer.name}
            </h1>

            <p className="mt-2 text-gray-500">
              {customer.phone || "No phone"}
            </p>
          </div>

          <span className="rounded bg-gray-800 px-3 py-1 text-sm">
            {customer.status}
          </span>
        </div>

        <div className="mt-6 space-y-2">
          <p>
            <strong>Source:</strong> {customer.source}
          </p>

          <p>
            <strong>Need:</strong>{" "}
            {customer.need || "No need recorded"}
          </p>
        </div>
      </div>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Follow-up History
        </h2>

        {interactions.length === 0 ? (
          <p className="mt-4 text-gray-500">
            No interactions yet.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {interactions.map((interaction) => (
              <div
                key={interaction.id}
                className="rounded-lg border p-4"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {interaction.type}
                  </span>

                  <span className="text-sm text-gray-500">
                    {new Date(
                      interaction.created_at
                    ).toLocaleString()}
                  </span>
                </div>

                <p className="mt-3">
                  {interaction.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}