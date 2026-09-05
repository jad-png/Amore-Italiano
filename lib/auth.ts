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
  const primaryEmail = user.primaryEmailAddress?.emailAddress;

  const isAdmin =
    user.publicMetadata?.role === "admin" ||
    primaryEmail === process.env.ADMIN_EMAIL;

  if (!isAdmin) {
    redirect("/admin/sign-in?error=forbidden");
  }

  return userId;
}
