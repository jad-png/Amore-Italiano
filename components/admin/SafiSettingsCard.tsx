"use client";

import Image from "next/image";
import { Trash2, Upload, Loader2 } from "lucide-react";
import { FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  deleteSafiImage,
  updateSafiSettings,
  uploadSafiImage,
} from "@/app/actions/cms";

type SafiSettings = {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  images: string[];
};

export default function SafiSettingsCard({ initialSettings }: { initialSettings: SafiSettings }) {
  const [images, setImages] = useState(initialSettings.images);
  const [uploading, setUploading] = useState(false);
  const [deletingImage, setDeletingImage] = useState<string | null>(null);
  const [isSaving, startSaving] = useTransition();

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    if (!files.length) return;

    setUploading(true);
    const uploaded: string[] = [];
    try {
      for (const file of files) {
        const formData = new FormData();
        formData.set("image", file);
        const result = await uploadSafiImage(formData);
        if ("error" in result) throw new Error(result.error);
        if (result.url) uploaded.push(result.url);
      }
      setImages((current) => [...current, ...uploaded].slice(0, 30));
      toast.success(`${uploaded.length} image${uploaded.length > 1 ? "s" : ""} ajoutée${uploaded.length > 1 ? "s" : ""}.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Impossible de téléverser les images.");
    } finally {
      setUploading(false);
      event.target.value = "";
    }
  }

  function handleRemove(url: string) {
    setDeletingImage(url);
    startSaving(async () => {
      try {
        await deleteSafiImage(url);
        setImages((current) => current.filter((image) => image !== url));
        toast.success("Image supprimée de la galerie.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Impossible de supprimer l'image.");
      } finally {
        setDeletingImage(null);
      }
    });
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    formData.set("safi_images", JSON.stringify(images));

    startSaving(async () => {
      try {
        await updateSafiSettings(formData);
        toast.success("La présentation et la galerie Safi ont été enregistrées.");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Impossible d'enregistrer les modifications.");
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="serif text-3xl">Présentation &amp; Galerie Safi</h2>
        <p className="mt-1 text-sm text-[#6e6a61]">
          Gérez le contenu affiché dans la présentation de Safi et sa galerie photo.
        </p>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-bold">
          Titre
          <input name="safi_title" defaultValue={initialSettings.title} className="mt-2 w-full rounded-lg border border-[#ded8cc] p-3 font-normal" />
        </label>
        <label className="block text-sm font-bold">
          Description
          <textarea name="safi_description" defaultValue={initialSettings.description} rows={5} className="mt-2 w-full rounded-lg border border-[#ded8cc] p-3 font-normal" />
        </label>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-bold">
            Texte du bouton
            <input name="safi_button_text" defaultValue={initialSettings.buttonText} className="mt-2 w-full rounded-lg border border-[#ded8cc] p-3 font-normal" />
          </label>
          <label className="block text-sm font-bold">
            Lien du bouton
            <input name="safi_button_link" defaultValue={initialSettings.buttonLink} placeholder="/safi" className="mt-2 w-full rounded-lg border border-[#ded8cc] p-3 font-normal" />
          </label>
        </div>
      </div>

      <div className="mt-7 border-t border-[#ded8cc] pt-6">
        <div className="mb-3 flex items-center justify-between gap-4">
          <div>
            <h3 className="font-bold">Photos de Safi</h3>
            <p className="text-xs text-[#6e6a61]">JPG, PNG, WebP ou AVIF · 8 Mo maximum par image</p>
          </div>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-[#596246] px-4 py-2 text-xs font-bold text-[#596246] transition hover:bg-[#596246] hover:text-white">
            {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            {uploading ? "ENVOI..." : "AJOUTER DES PHOTOS"}
            <input type="file" accept="image/jpeg,image/png,image/webp,image/avif" multiple onChange={handleUpload} disabled={uploading} className="sr-only" />
          </label>
        </div>

        {images.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((url) => (
              <div key={url} className="group relative overflow-hidden rounded-lg border border-[#ded8cc] bg-[#f7f2e8]">
                <Image src={url} alt="Photo de Safi" width={320} height={220} className="aspect-[4/3] w-full object-cover" />
                <button
                  type="button"
                  aria-label="Supprimer cette photo"
                  onClick={() => handleRemove(url)}
                  disabled={deletingImage === url || isSaving}
                  className="absolute right-2 top-2 rounded-full bg-white/90 p-2 text-[#a92e27] shadow transition hover:bg-[#a92e27] hover:text-white disabled:opacity-60"
                >
                  {deletingImage === url ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#b9b1a4] p-8 text-center text-sm text-[#6e6a61]">
            Aucune photo dans la galerie pour le moment.
          </div>
        )}
      </div>

      <button type="submit" disabled={isSaving || uploading} className="mt-7 inline-flex items-center gap-2 rounded-full bg-[#a92e27] px-5 py-3 text-sm font-bold !text-white disabled:cursor-not-allowed disabled:opacity-60">
        {isSaving && <Loader2 size={16} className="animate-spin" />}
        {isSaving ? "ENREGISTREMENT..." : "ENREGISTRER LES MODIFICATIONS"}
      </button>
    </form>
  );
}
