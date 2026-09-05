import { SignIn, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { userId } = await auth();
  const { error } = await searchParams;

  if (userId && error !== "forbidden") {
    redirect("/admin");
  }

  if (userId && error === "forbidden") {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-32">
        <section className="w-full max-w-md rounded-2xl bg-[#f7f2e8] p-8 text-center shadow-xl">
          <h1 className="serif text-4xl">403 — Accès refusé</h1>
          <p className="mt-3 text-[#4a4741]">
            Ce compte ne dispose pas des droits administrateur requis.
          </p>
          <SignOutButton redirectUrl="/admin/sign-in">
            <button className="mt-6 rounded-full bg-[#a92e27] px-5 py-3 text-sm font-bold !text-white">
              SE DÉCONNECTER
            </button>
          </SignOutButton>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-32">
      <SignIn
        path="/admin/sign-in"
        routing="path"
        fallbackRedirectUrl="/admin"
      />
    </main>
  );
}
