import { SignIn, SignOutButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";

export default async function AdminSignInPage() {
  const { userId } = await auth();

  if (userId) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-32">
        <section className="w-full max-w-md rounded-2xl bg-[#f7f2e8] p-8 text-center shadow-xl">
          <h1 className="serif text-4xl">You are currently signed in</h1>
          <p className="mt-3 text-[#4a4741]">
            Déconnectez-vous pour utiliser un autre compte administrateur.
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
