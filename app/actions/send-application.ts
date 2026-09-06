"use server";

import { Resend } from "resend";
import { randomUUID } from "node:crypto";
import { supabase } from "@/lib/supabase";

const resend = new Resend(process.env.RESEND_API_KEY);
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function sanitizeFilename(filename: string) {
  return (
    filename
      .replace(/[\\/]/g, "")
      .replace(/\.\.+/g, ".")
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .replace(/^\.+/, "")
      .slice(0, 255) || "cv"
  );
}

function hasValidMagicBytes(buffer: Buffer) {
  const isPdf = buffer.subarray(0, 4).toString("ascii") === "%PDF";
  const isDocx = buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  const isDoc = buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
  return isPdf || isDocx || isDoc;
}

async function ensureResumesBucket() {
  const { data: bucket, error: lookupError } = await supabase.storage.getBucket("resumes");
  if (bucket) return null;

  const { error: createError } = await supabase.storage.createBucket("resumes", {
    public: false,
  });

  if (createError && !createError.message.toLowerCase().includes("already exists")) {
    console.error("[Application] Unable to initialize resumes bucket:", {
      lookupError: lookupError?.message,
      createError: createError.message,
    });
    return createError;
  }

  return null;
}

export async function sendApplication(formData: FormData) {
  try {
    const from = process.env.RESEND_FROM_EMAIL;
    const to = process.env.RESEND_TO_EMAIL;

    if (!process.env.RESEND_API_KEY || !from || !to) {
      return { error: "La configuration Resend est incomplète." };
    }

    const nom = String(formData.get("nom") ?? "");
    const prenom = String(formData.get("prenom") ?? "");
    const telephone = String(formData.get("telephone") ?? "");
    const ville = String(formData.get("ville") ?? "");
    const adresse = String(formData.get("adresse") ?? "");
    const genre = String(formData.get("genre") ?? "");
    const poste = String(formData.get("poste") ?? "");
    const cvFile = formData.get("cv");

    if (!(cvFile instanceof File) || cvFile.size === 0) {
      return { error: "Veuillez sélectionner votre CV." };
    }

    if (cvFile.size > MAX_FILE_SIZE) {
      return { error: "Le CV doit faire 5 Mo maximum." };
    }

    const content = Buffer.from(await cvFile.arrayBuffer());

    if (content.length === 0 || content.length > MAX_FILE_SIZE) {
      return { error: "Le CV doit faire 5 Mo maximum." };
    }

    if (!hasValidMagicBytes(content)) {
      return { error: "Format de CV invalide." };
    }

    const filename = sanitizeFilename(cvFile.name);
    const extension = filename.includes(".") ? filename.split(".").pop() : "pdf";
    const contentType = extension === "pdf"
      ? "application/pdf"
      : extension === "docx"
        ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        : "application/msword";
    const storagePath = `${new Date().toISOString().slice(0, 10)}/${randomUUID()}-${filename}`;

    const bucketError = await ensureResumesBucket();
    if (bucketError) {
      return { error: "Le stockage des CV est temporairement indisponible." };
    }

    const { error: uploadError } = await supabase.storage
      .from("resumes")
      .upload(storagePath, content, { contentType, upsert: false });

    if (uploadError) {
      console.error("[Application] CV upload failed:", {
        message: uploadError.message,
        name: uploadError.name,
        status: uploadError.statusCode,
      });
      return { error: "Impossible d'enregistrer le CV. Vérifiez le stockage Supabase." };
    }

    const { error: insertError } = await supabase.from("applications").insert({
      nom,
      prenom,
      telephone,
      ville,
      adresse,
      genre,
      poste,
      resume_url: storagePath,
    });

    if (insertError) {
      await supabase.storage.from("resumes").remove([storagePath]);
      return { error: "Impossible d'enregistrer la candidature." };
    }

    const summary = [
      ["Nom", nom],
      ["Prénom", prenom],
      ["Téléphone", telephone],
      ["Ville", ville],
      ["Adresse", adresse],
      ["Genre", genre],
      ["Poste souhaité", poste],
    ]
      .map(([label, value]) => `<tr><th>${label}</th><td>${escapeHtml(value)}</td></tr>`)
      .join("");

    const { error } = await resend.emails.send({
      from,
      to,
      subject: `Nouvelle candidature — ${nom} ${prenom}`,
      html: `<h1>Nouvelle candidature</h1><table>${summary}</table><p>Le CV est joint à cet e-mail.</p>`,
      attachments: [{ filename, content }],
    });

    if (error) {
      return { error: error.message || "Impossible d'envoyer la candidature." };
    }

    return { success: true };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Une erreur est survenue.",
    };
  }
}
