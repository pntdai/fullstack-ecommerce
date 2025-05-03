import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { EUserRole } from "@/constants/enum";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PropsWithChildren } from "react";

const AdminDashboardLayout = async ({ children }: PropsWithChildren) => {
  // Block non admins from accessing the admin dashboard
  const user = await currentUser();
  if (!user || user.privateMetadata.role !== EUserRole.ADMIN) redirect("/");

  return (
    <div className="w-full h-full">
      {/* Sidebar */}
      <Sidebar isAdmin />
      <div className="ml-[300px]">
        {/* Header */}
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
};

export default AdminDashboardLayout;
