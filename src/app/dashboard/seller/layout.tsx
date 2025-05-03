import { EUserRole } from "@/constants/enum";
import { PORTAL_PATHS } from "@/constants/path";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await currentUser();

  if (user?.privateMetadata.role !== EUserRole.SELLER)
    redirect(PORTAL_PATHS.USER_DASHBOARD);

  return <div>{children}</div>;
}
