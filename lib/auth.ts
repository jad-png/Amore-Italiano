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

  if (user.publicMetadata?.role !== "admin") {
    redirect("/admin/sign-in");
  }

  return userId;
}
