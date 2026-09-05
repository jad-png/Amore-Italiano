import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

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
      <div className="mt-10 overflow-x-auto rounded-xl bg-white shadow-sm">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-[#ded8cc] text-xs uppercase tracking-wider text-[#4a4741]">
            <tr><th className="p-4">Date</th><th className="p-4">Candidate</th><th className="p-4">Poste</th><th className="p-4">Téléphone</th><th className="p-4">Statut</th><th className="p-4">CV</th></tr>
          </thead>
          <tbody>
            {rows.map((application) => (
              <tr key={application.id} className="border-b border-[#ded8cc] last:border-0">
                <td className="p-4 whitespace-nowrap">{new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium" }).format(new Date(application.created_at))}</td>
                <td className="p-4 font-semibold">{application.prenom} {application.nom}</td>
                <td className="p-4">{application.poste || "—"}</td>
                <td className="p-4 whitespace-nowrap">{application.telephone}</td>
                <td className="p-4"><form action={updateApplicationStatus} className="flex items-center gap-2"><input type="hidden" name="id" value={application.id}/><select name="status" defaultValue={application.status} className="rounded-full border border-[#ded8cc] px-3 py-2 text-xs font-bold"><option value="pending">pending</option><option value="reviewed">reviewed</option><option value="rejected">rejected</option></select><button className="text-xs font-bold text-[#a92e27]">OK</button></form></td>
                <td className="p-4">{application.downloadUrl ? <a href={application.downloadUrl} target="_blank" rel="noreferrer" className="font-bold text-[#a92e27]">TÉLÉCHARGER</a> : <span className="text-[#4a4741]">Indisponible</span>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {!rows.length && <p className="p-8 text-[#4a4741]">Aucune candidature reçue.</p>}
      </div>
    </section>
  );
}
