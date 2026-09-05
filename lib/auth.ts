import { clerkClient, auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function assertAdmin() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/admin/sign-in");
  }

  if (userId === process.env.ADMIN_USER_ID) {
    return userId;
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const hasAdminEmail = Boolean(
    adminEmail &&
      user.emailAddresses.some(
        (email) => email.emailAddress.toLowerCase() === adminEmail,
      ),
  );

  const isAdmin =
    user.publicMetadata?.role === "admin" ||
    hasAdminEmail;

  if (!isAdmin) {
    redirect("/admin/sign-in?error=forbidden");
  }

  return userId;
}
