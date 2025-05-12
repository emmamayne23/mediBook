// import Navbar from "@/components/Navbar";
import NavClient from "@/components/NavClient";
export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main>
        <NavClient />
        <div className="mt-19">
          {children}
        </div>
    </main>
  );
}
