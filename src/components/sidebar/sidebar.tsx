// React, Next.js
import { FC } from "react";

// Clerk
import {
  adminDashboardSidebarOptions,
  SellerDashboardSidebarOptions,
} from "@/constants/data";
import { currentUser } from "@clerk/nextjs/server";
import Logo from "../shared/logo";
import SidebarNavAdmin from "./nav-admin";
import SidebarNavSeller from "./nav-seller";
import UserInfo from "./user-info";

interface SidebarProps {
  isAdmin?: boolean;
}

const Sidebar: FC<SidebarProps> = async ({ isAdmin }) => {
  const user = await currentUser();
  return (
    <div className="w-[300px] border-r h-screen p-4 flex flex-col fixed top-0 left-0 bottom-0">
      <Logo width="100%" height="180px" />
      <span className="mt-3" />
      {user && <UserInfo user={user} />}
      {isAdmin ? (
        <SidebarNavAdmin menuLinks={adminDashboardSidebarOptions} />
      ) : (
        <SidebarNavSeller menuLinks={SellerDashboardSidebarOptions} />
      )}
    </div>
  );
};

export default Sidebar;
