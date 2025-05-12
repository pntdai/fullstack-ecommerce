import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerStoreDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();
  if (!user) {
    redirect("/");
  }

  // Retrieve the list of stores associated with the authenticated user.
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
    },
  });

  return <div>{children}</div>;
}
