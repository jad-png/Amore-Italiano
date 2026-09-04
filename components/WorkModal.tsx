"use client";

import React, { useEffect, useState } from "react";
import { sendApplication } from "@/app/actions/send-application";

export default function WorkModal() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fn = () => {
      setOpen(true);
      setDone(false);
      setError("");
    };
    window.addEventListener("open-work-modal", fn);
    return () => window.removeEventListener("open-work-modal", fn);
  }, []);

  if (!open) return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const file = (form.elements.namedItem("cv") as HTMLInputElement).files?.[0];
    if (!file) {
      setError("Veuillez sélectionner votre CV.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Le CV doit faire 5 Mo maximum.");
      return;
    }
    if (
      !["pdf", "doc", "docx"].includes(
        (file.name.split(".").pop() || "").toLowerCase()
      )
    ) {
      setError("Format accepté : PDF, DOC ou DOCX.");
      return;
    }
    const result = await sendApplication(new FormData(form));
    if ("error" in result) {
      setError(result.error ?? "Impossible d'envoyer la candidature.");
      return;
    }
    setDone(true);
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-5 backdrop-blur-md"
      onClick={(e) => e.target === e.currentTarget && setOpen(false)}
    >
      <div
        className="relative max-h-[92vh] w-full max-w-[680px] overflow-auto rounded-[18px] bg-[#f7f2e8] p-7 shadow-2xl md:p-9"
        role="dialog"
        aria-modal="true"
        aria-labelledby="workTitle"
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-3 h-10 w-10 rounded-full border border-[#ded8cc] text-2xl"
          aria-label="Fermer"
        >
          ×
        </button>

        {done ? (
          <div className="py-7 text-center">
            <div className="text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
              Grazie ❤️
            </div>
            <h3 className="serif mt-2 text-4xl">Candidature prête.</h3>
            <p className="my-3 text-[#4a4741]">
              Le formulaire a été validé. Pour recevoir réellement les
              candidatures, il faudra connecter ce formulaire à un serveur ou un
              service d&apos;envoi.
            </p>
            <button
              onClick={() => setOpen(false)}
              className="rounded-full bg-[#a92e27] px-5 py-3 text-sm font-bold !text-white"
            >
              FERMER
            </button>
          </div>
        ) : (
          <>
            <div className="text-xs font-bold uppercase tracking-[.18em] text-[#a92e27]">
              Amore Italiano · Safi
            </div>
            <h2
              id="workTitle"
              className="serif my-2 text-[clamp(38px,6vw,56px)] leading-none"
            >
              Travailler avec nous.
            </h2>
            <p className="mb-6 text-[#4a4741]">
              Vous souhaitez rejoindre notre équipe ? Envoyez-nous votre
              candidature.
            </p>
            <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
              <Field label="Nom *" name="nom" />
              <Field label="Prénom *" name="prenom" />
              <Field
                label="Numéro de téléphone *"
                name="telephone"
                type="tel"
                placeholder="+212 6 XX XX XX XX"
              />
              <Field label="Ville *" name="ville" />
              <Field label="Adresse" name="adresse" full />
              <Field
                label="Genre *"
                name="genre"
                select
                options={[
                  "Sélectionner",
                  "Homme",
                  "Femme",
                  "Autre",
                  "Je préfère ne pas préciser",
                ]}
              />
              <Field
                label="Poste souhaité"
                name="poste"
                select
                options={[
                  "Sélectionner",
                  "Serveur / Serveuse",
                  "Cuisinier / Cuisinière",
                  "Pâtisserie / Gelato",
                  "Bar / Café",
                  "Management",
                  "Autre",
                ]}
              />
              <label className="flex flex-col gap-2 text-xs font-bold md:col-span-2">
                Votre CV *
                <span className="rounded-xl border border-dashed border-[#b9b1a4] bg-[#fffaf2] p-4">
                  <input
                    name="cv"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    required
                    className="font-normal"
                  />
                  <small className="mt-1 block font-normal text-[#4a4741]">
                    PDF, DOC ou DOCX · 5 Mo maximum
                  </small>
                </span>
              </label>
              {error && (
                <p className="text-xs text-[#a92e27] md:col-span-2">{error}</p>
              )}
              <button className="rounded-full bg-[#a92e27] px-5 py-3 text-sm font-bold !text-white md:col-span-2">
                ENVOYER MA CANDIDATURE →
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  full,
  select,
  options,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  full?: boolean;
  select?: boolean;
  options?: string[];
}) {
  const c = `flex flex-col gap-2 text-xs font-bold ${
    full ? "md:col-span-2" : ""
  }`;
  return (
    <label className={c}>
      {label}
      {select ? (
        <select
          name={name}
          required={name === "genre"}
          className="rounded-xl border border-[#ded8cc] bg-[#fffaf2] p-3 font-normal outline-none focus:border-[#a92e27]"
        >
          {options?.map((o, i) => (
            <option key={o} value={i === 0 ? "" : o}>
              {o}
            </option>
          ))}
        </select>
      ) : (
        <input
          name={name}
          type={type}
          placeholder={placeholder}
          required={label.includes("*")}
          className="rounded-xl border border-[#ded8cc] bg-[#fffaf2] p-3 font-normal outline-none focus:border-[#a92e27]"
        />
      )}
    </label>
  );
}
