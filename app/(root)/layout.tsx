import Navbar from "@/components/Navbar";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
        <Navbar />
        <div className="mt-20">
          {children}
        </div>
    </main>
  );
}
