
import { Auth } from "./auth";
import Link from "next/link";
import Image from "next/image";

import logo from "@/public/logo.png";

export default function Navbar() {
  
  return (
    <nav className="z-50 bg-background flex justify-between items-center shadow-md p-3 gap-3 fixed top-0 right-0 left-0">
      <Link href={"/"} className=" bg-blue-600 dark:bg-transparent px-1.5 md:px-3 rounded-sm">
        <Image src={logo} alt="logo" width={200} height={100} />
      </Link>
      <div>
        <Auth />
      </div>
    </nav>
  );
}
