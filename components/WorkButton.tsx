"use client";
export default function WorkButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("open-work-modal"))}
      className="mt-7 rounded-full bg-[#a92e27] px-6 py-3 text-sm font-bold !text-white"
    >
      ENVOYER MA CANDIDATURE →
    </button>
  );
}
