import { SignIn } from "@clerk/nextjs";

export default function AdminSignInPage() {
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
