import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import ApplicationsTable from "@/components/admin/ApplicationsTable";

export const metadata: Metadata = { title: "Candidatures" };
export const dynamic = "force-dynamic";

type ApplicationStatus = "pending" | "reviewed" | "rejected";

async function updateApplicationStatus(formData: FormData) {
  "use server";

  await assertAdmin();
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "") as ApplicationStatus;

  if (!id || !["pending", "reviewed", "rejected"].includes(status)) {
    throw new Error("Statut de candidature invalide.");
  }

  const { error } = await supabase
    .from("applications")
    .update({ status })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/admin/applications");
}

export default async function AdminApplicationsPage() {
  await assertAdmin();

  const { data: applicationsData } = await supabase
    .from("applications")
    .select("id, nom, prenom, poste, telephone, status, created_at, resume_url")
    .order("created_at", { ascending: false });

  const applications = applicationsData ?? [];
  const rows = await Promise.all(
    applications.map(async (application) => {
      const { data } = await supabase.storage
        .from("resumes")
        .createSignedUrl(application.resume_url, 60 * 15);
      return { ...application, downloadUrl: data?.signedUrl ?? null };
    }),
  );

  return (
    <section className="mx-auto w-[92%] max-w-[1180px] py-14">
      <p className="text-xs font-bold uppercase tracking-[.2em] text-[#a92e27]">Administration</p>
      <h1 className="serif mt-3 text-6xl">Candidatures.</h1>
      <ApplicationsTable applications={rows} updateStatus={updateApplicationStatus} />
    </section>
  );
}
