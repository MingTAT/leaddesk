"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase/server";

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