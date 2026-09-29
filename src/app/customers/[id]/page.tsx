import Link from "next/link";
import { notFound } from "next/navigation";

import { supabaseAdmin } from "@/lib/supabase/server";

import {
  addInteraction,
  updateCustomerStatus,
} from "../actions";

type CustomerPageProps = {
  params: Promise<{
    id: string;
  }>;
};

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

export default async function CustomerPage({
  params,
}: CustomerPageProps) {
  const { id } = await params;

  const addInteractionForCustomer =
    addInteraction.bind(null, id);

  const updateStatusForCustomer =
    updateCustomerStatus.bind(null, id);

  const { data: customer, error } =
    await supabaseAdmin
      .from("customers")
      .select("*")
      .eq("id", id)
      .single();

  if (error || !customer) {
    notFound();
  }

  const { data: interactions } =
    await supabaseAdmin
      .from("interactions")
      .select("*")
      .eq("customer_id", id)
      .order("created_at", {
        ascending: false,
      });

  return (
    <main className="mx-auto max-w-3xl p-8">
      <Link
        href="/customers"
        className="text-gray-500 hover:text-gray-300"
      >
        ← Back to customers
      </Link>

      <div className="mt-8 rounded-lg border p-6">
        <div className="flex items-start justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold">
              {customer.name}
            </h1>

            <p className="mt-2 text-gray-500">
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

        <div className="mt-6 space-y-2">
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
      </div>

      <section className="mt-8">
        <h2 className="text-xl font-semibold">
          Customer Status
        </h2>

        <form
          action={updateStatusForCustomer}
          className="mt-4 flex gap-3"
        >
          <select
            name="status"
            defaultValue={customer.status}
            className="rounded-lg border border-gray-700 bg-black px-4 py-3"
          >
            <option value="new">New</option>
            <option value="contacted">
              Contacted
            </option>
            <option value="interested">
              Interested
            </option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <button
            type="submit"
            className="rounded-lg bg-white px-5 py-3 font-medium text-black"
          >
            Update Status
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Add Follow-up
        </h2>

        <form
          action={addInteractionForCustomer}
          className="mt-5 space-y-4 rounded-lg border p-5"
        >
          <select
            name="type"
            defaultValue="wechat"
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          >
            <option value="phone">
              Phone
            </option>
            <option value="wechat">
              WeChat
            </option>
            <option value="meeting">
              Meeting
            </option>
            <option value="other">
              Other
            </option>
          </select>

          <textarea
            name="content"
            required
            rows={4}
            className="w-full rounded-lg border border-gray-700 bg-transparent p-3"
            placeholder="What happened in this follow-up?"
          />

          <button
            type="submit"
            className="rounded-lg bg-white px-5 py-3 font-medium text-black"
          >
            Add Follow-up
          </button>
        </form>
      </section>

      <section className="mt-10">
        <h2 className="text-2xl font-semibold">
          Follow-up History
        </h2>

        {!interactions ||
        interactions.length === 0 ? (
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
                <div className="flex justify-between gap-6">
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