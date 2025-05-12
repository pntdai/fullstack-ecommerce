import Header from "@/components/dashboard/header/header";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import { ReactNode } from "react";

export default function SellerDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="w-full h-full">
      <Sidebar />
      <div className="ml-[300px]">
        <Header />
        <div className="w-full mt-[75px] p-4">{children}</div>
      </div>
    </div>
  );
}
