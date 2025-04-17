import { EUserRole } from "@/constant/enum";
import { PORTAL_PATHS } from "@/constant/path";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const DashboardPage = async () => {
  // Get current user and redirect to depending on url role
  const user = await currentUser();

  if (user?.privateMetadata?.role === EUserRole.ADMIN)
    redirect(PORTAL_PATHS.ADMIN_DASHBOARD);
  if (user?.privateMetadata?.role === EUserRole.SELLER)
    redirect(PORTAL_PATHS.SELLER_DASHBOARD);
  if (user?.privateMetadata?.role === EUserRole.USER)
    redirect(PORTAL_PATHS.USER_DASHBOARD);
};

export default DashboardPage;
