"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

const allowedStatuses = [
  "new",
  "contacted",
  "interested",
  "won",
  "lost",
];

export async function createCustomer(formData: FormData) {
  const name = formData.get("name")?.toString().trim();
  const phone = formData.get("phone")?.toString().trim();
  const source = formData.get("source")?.toString();
  const status = formData.get("status")?.toString();
  const need = formData.get("need")?.toString().trim();

  if (!name) {
    throw new Error("Customer name is required.");
  }

  const { error } = await supabaseAdmin
    .from("customers")
    .insert({
      name,
      phone: phone || null,
      source: source || "other",
      status: status || "new",
      need: need || null,
    });

  if (error) {
    throw new Error(`Failed to create customer: ${error.message}`);
  }

  revalidatePath("/customers");
  redirect("/customers");
}

export async function addInteraction(
  customerId: string,
  formData: FormData
) {
  const type = formData.get("type")?.toString();
  const content = formData.get("content")?.toString().trim();

  if (!content) {
    throw new Error("Follow-up content is required.");
  }

  const { error } = await supabaseAdmin
    .from("interactions")
    .insert({
      customer_id: customerId,
      type: type || "other",
      content,
    });

  if (error) {
    throw new Error(
      `Failed to add interaction: ${error.message}`
    );
  }

  revalidatePath(`/customers/${customerId}`);
}

export async function updateCustomerStatus(
  customerId: string,
  formData: FormData
) {
  const status = formData.get("status")?.toString();

  if (!status || !allowedStatuses.includes(status)) {
    throw new Error("Invalid customer status.");
  }

  const { error } = await supabaseAdmin
    .from("customers")
    .update({ status })
    .eq("id", customerId);

  if (error) {
    throw new Error(
      `Failed to update customer status: ${error.message}`
    );
  }

  revalidatePath("/customers");
  revalidatePath(`/customers/${customerId}`);
}