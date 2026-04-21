import "server-only";

import { auth, currentUser } from "@clerk/nextjs/server";

function getAllowedAdminEmails() {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined) {
  if (!email) {
    return false;
  }

  const allowedEmails = getAllowedAdminEmails();

  if (allowedEmails.length === 0) {
    return false;
  }

  return allowedEmails.includes(email.toLowerCase());
}

export async function requireAdminSession() {
  const { userId } = await auth();

  if (!userId) {
    return {
      ok: false as const,
      reason: "Your session is not authorized for this action.",
    };
  }

  const user = await currentUser();
  const email = user?.primaryEmailAddress?.emailAddress ?? null;

  if (!user) {
    return {
      ok: false as const,
      reason: "Your session could not be resolved.",
    };
  }

  if (!isAdminEmail(email)) {
    return {
      ok: false as const,
      reason: "Your account is signed in, but it is not allowed to access admin.",
    };
  }

  return {
    ok: true as const,
    user,
    email,
  };
}
