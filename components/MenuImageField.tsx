"use client";

import { useState } from "react";
import { uploadMenuImage } from "@/app/actions/cms";

export default function MenuImageField({
  defaultValue = "",
}: {
  defaultValue?: string;
}) {
  const [url, setUrl] = useState(defaultValue);
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState("");
  const [uploading, setUploading] = useState(false);

  async function upload() {
    if (!file) {
      setMessage("Sélectionnez une image.");
      return;
    }

    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.set("image", file);
    const result = await uploadMenuImage(formData);
    setUploading(false);

    if ("error" in result) {
      setMessage(result.error ?? "Impossible d'enregistrer l'image.");
      return;
    }

    setUrl(result.url ?? "");
    setMessage("Image enregistrée.");
  }

  return (
    <div className="space-y-2 md:col-span-2">
      <div className="flex flex-wrap gap-2">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
          className="min-w-0 flex-1 rounded-lg border border-[#ded8cc] p-2 text-sm"
        />
        <button
          type="button"
          onClick={upload}
          disabled={uploading}
          className="rounded-full border border-[#596246] px-4 py-2 text-xs font-bold text-[#596246] disabled:opacity-50"
        >
          {uploading ? "ENVOI..." : "TÉLÉVERSER"}
        </button>
      </div>
      <input
        name="image_url"
        value={url}
        onChange={(event) => setUrl(event.target.value)}
        placeholder="URL ou chemin de l'image"
        className="w-full rounded-lg border border-[#ded8cc] p-3 text-sm"
      />
      {message && <p className="text-xs text-[#4a4741]">{message}</p>}
    </div>
  );
}
