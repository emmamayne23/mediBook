import AdminSidebar from "@/components/AdminSidebar";
import { ModeToggle } from "@/components/toggle-mode";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />

      <div className="flex-1 md:ml-64 transition-all duration-300">
        <div className="fixed top-5 right-5 z-50 dark:bg-gray-800 bg-background rounded-lg">
          <ModeToggle />
        </div>
        {/* Main Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
