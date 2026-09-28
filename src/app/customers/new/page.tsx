import Link from "next/link";
import { createCustomer } from "../actions";

export default function NewCustomerPage() {
  return (
    <main className="mx-auto max-w-2xl p-8">
      <div className="mb-8">
        <Link
          href="/customers"
          className="text-sm text-gray-500 hover:text-gray-300"
        >
          ← Back to customers
        </Link>

        <h1 className="mt-4 text-3xl font-bold">
          Add Customer
        </h1>
      </div>

      <form action={createCustomer} className="space-y-6">

        <div>
          <label className="mb-2 block font-medium">
            Name
          </label>

          <input
            name="name"
            required
            className="w-full rounded-lg border border-gray-700 bg-transparent p-3"
            placeholder="e.g. 刘女士"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Phone
          </label>

          <input
            name="phone"
            className="w-full rounded-lg border border-gray-700 bg-transparent p-3"
            placeholder="13800000000"
          />
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Source
          </label>

          <select
            name="source"
            defaultValue="other"
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          >
            <option value="douyin">Douyin</option>
            <option value="wechat">WeChat</option>
            <option value="offline">Offline</option>
            <option value="referral">Referral</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Status
          </label>

          <select
            name="status"
            defaultValue="new"
            className="w-full rounded-lg border border-gray-700 bg-black p-3"
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="interested">Interested</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block font-medium">
            Need
          </label>

          <textarea
            name="need"
            rows={5}
            className="w-full rounded-lg border border-gray-700 bg-transparent p-3"
            placeholder="What does this customer need?"
          />
        </div>

        <button
          type="submit"
          className="rounded-lg bg-white px-5 py-3 font-medium text-black"
        >
          Save Customer
        </button>

      </form>
    </main>
  );
}