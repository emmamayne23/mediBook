import DoctorSidebar from "@/components/DoctorSidebar"

export default function DashboardLayout({ children }:  Readonly<{children: React.ReactNode}>) {
    return (
        <div>
            <DoctorSidebar />
            <div className="pl-16">
                {children}
            </div>
        </div>
    )
}