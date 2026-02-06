import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardSidebar } from "../_components/DashboardSidebar";
import Link from "next/link";
import { House } from "lucide-react";
import LogoutBtn from "../_components/LogoutBtn";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = (await cookies()).get("token");
  if (!token) {
    redirect("/login");
  }
  return (
    <div className="flex w-full text-black">
      <SidebarProvider>
        <DashboardSidebar />

        <main className="flex flex-col w-full">
          <div className="p-3 flex items-center justify-between bg-main-color-dark text-white">
            <SidebarTrigger />
            <div className="flex items-center gap-6">
              <Link
                className="px-4 py-2 bg-white text-black hover:opacity-65 duration-500 rounded-md text-sm flex items-center gap-2"
                href={"/"}>
                <House className="w-4 h-4" />
                الصفحة الرئيسية
              </Link>
              <LogoutBtn />
            </div>
          </div>
          <div className="p-5 bg-[#FCFBFC] min-h-[calc(100vh-3.9rem)]">
            {children}
          </div>
        </main>
      </SidebarProvider>
    </div>
  );
}
