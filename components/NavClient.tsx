"use client";
import Image from "next/image";
import logo from "@/public/logo.png";
import Link from "next/link";
import { ModeToggle } from "./toggle-mode";
import { useSession, signOut } from "next-auth/react";
import { MdOutlineMenu } from "react-icons/md";
import { FaSignOutAlt, FaSignInAlt } from "react-icons/fa";

import { useState } from "react";

export default function NavClient() {
  const { data: session } = useSession();
  const user = session?.user;
  // console.log(user);

  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="z-50 bg-background flex justify-between items-center shadow-md p-3 gap-3 fixed top-0 right-0 left-0">
      <Link
        href={"/"}
        className=" bg-blue-600 dark:bg-transparent px-1.5 md:px-3 rounded-sm"
      >
        <Image src={logo} alt="logo" width={200} height={100} />
      </Link>

      {/* the navigation links for larger screens */}
      <ul id="nav-links" className="hidden md:flex items-center gap-1">
        {[
          { href: "/", label: "Home" },
          { href: "/doctors", label: "Find a Doctor" },
          { href: "/departments", label: "Services" },
          { href: "/blogs", label: "Blog" },
          { href: "/contact", label: "Contact" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="
                relative
                px-4 py-2
                text-gray-700 dark:text-gray-300
                hover:text-blue-600 dark:hover:text-blue-400
                transition-colors duration-300
                group
                text-center
                font-medium
                rounded-lg
                flex items-center justify-center
                lg:px-6 lg:py-3
              "
            >
              {item.label}

              {/* Animated underline */}
              <span
                className="
                  absolute left-1/2 bottom-1
                  w-0 h-0.5
                  bg-blue-600 dark:bg-blue-400
                  transform -translate-x-1/2
                  transition-all duration-300
                  group-hover:w-3/4
                  rounded-full
                "
              />

              {/* Hover background effect */}
              <span
                className="
                  absolute inset-0
                  bg-blue-50 dark:bg-gray-700
                  opacity-0
                  group-hover:opacity-100
                  transition-opacity duration-300
                  -z-10
                  rounded-lg
                "
              />
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex items-center gap-3">
        {user ? (
          <div className="flex items-center gap-3">
            <button
              onClick={() => signOut({ redirectTo: "/" })}
              className="cursor-pointer border-2 p-1 px-2.5 rounded-lg"
            >
              <FaSignOutAlt className="lg:hidden"/>
              <span className="hidden lg:flex">Sign Out</span>
            </button>
            <Link
              href={`/user-profile/${user.id}`}
              className="rounded-full flex justify-center items-center shadow-md"
            >
              {user.image ? (
                <Image
                  src={user.image || ""}
                  width={30}
                  height={30}
                  alt={user.name || ""}
                  className="rounded-full border"
                />
              ) : (
                <div className="font-semibold text-xl px-[8px] py-0.5 bg-blue-600 text-white rounded-full">
                  {(user.name?.[0] ?? "").toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        ) : (
          <Link href={"/sign-in"}>
            <FaSignInAlt className="lg:hidden"/>
            <span className="hidden lg:flex">Sign In</span>
          </Link>
        )}
        <ModeToggle />
        <button onClick={() => setIsOpen(!isOpen)}>
          <MdOutlineMenu className="text-2xl cursor-pointer md:hidden" />
        </button>

        {/* Mobile screens navigation */}
        <ul
          id="mobile-nav"
          className={`
            absolute top-19 left-0 right-0
            bg-white dark:bg-gray-800
            shadow-lg rounded-b-xl
            overflow-hidden
            flex flex-col
            transform origin-top
            transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
            md:hidden
            ${
              isOpen
                ? "scale-y-100 opacity-100 visible"
                : "scale-y-0 opacity-0 invisible"
            }
          `}
        >
          {[
            { href: "/", label: "Home" },
            { href: "/doctors", label: "Find a Doctor" },
            { href: "/departments", label: "Services" },
            { href: "/blogs", label: "Blog" },
            { href: "/contact", label: "Contact" },
          ].map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className="
                  px-6 py-4
                  border-b border-gray-200 dark:border-gray-700
                  text-gray-800 dark:text-gray-200
                  hover:bg-blue-50 dark:hover:bg-gray-700
                  hover:text-blue-600 dark:hover:text-blue-400
                  transition-all duration-200
                  flex items-center
                  group
                "
              >
                <span
                  className="
                    w-1 h-6 mr-4
                    bg-transparent
                    group-hover:bg-blue-600
                    transition-all duration-300
                    rounded-full
                  "
                />
                {item.label}
                <span
                  className="
                    ml-auto
                    opacity-0 group-hover:opacity-100
                    transition-opacity duration-300
                  "
                >
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
