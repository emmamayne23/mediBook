import DoctorSidebar from "@/components/DoctorSidebar"

export default function DashboardLayout({ children }:  Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <DoctorSidebar />
            {children}
        </div>
    )
}