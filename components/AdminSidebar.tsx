"use client";

import {
  FiUsers,
  FiUserPlus,
  FiCalendar,
  FiClock,
  FiStar,
  FiSettings,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiChevronRight,
  FiHome,
} from "react-icons/fi";
import { TbLayoutDashboard } from "react-icons/tb";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { HiOutlineLogout, HiOutlineUserCircle } from "react-icons/hi";
import Link from "next/link";

export default function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="relative">

        {/* <header className="bg-white dark:bg-gray-800 shadow-sm flex justify-between items-center sticky top-0 right-0 z-30">
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
            Dashboard Overview
          </h1>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <button className="flex items-center space-x-2 focus:outline-none">
                <HiOutlineUserCircle className="text-2xl text-gray-600 dark:text-gray-300" />
                {sidebarOpen && (
                  <span className="hidden md:block text-gray-700 dark:text-gray-200">
                    Admin User
                  </span>
                )}
              </button>
            </div>
          </div>
        </header> */}
      {/* Mobile sidebar toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-gray-800 text-white"
        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
      >
        {mobileSidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          ${sidebarOpen ? 'w-64' : 'w-20'} 
          ${mobileSidebarOpen ? 'flex' : 'hidden'} 
          md:flex flex-col
          bg-gray-800 dark:bg-gray-800
          border-r border-gray-700
          transition-all duration-300 ease-in-out
          fixed h-full z-40
        `}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          {sidebarOpen ? (
            <h2 className="text-xl font-semibold text-white pl-10 pt-1 md:pl-0 md:pt-0">MediBook Admin</h2>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">M</span>
            </div>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="hidden md:block text-gray-400 hover:text-white"
          >
            {sidebarOpen ? <FiChevronLeft size={20} /> : <FiChevronRight size={20} />}
          </button>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            {[
              { href: "/admin", icon: <TbLayoutDashboard />, label: "Dashboard" },
              { href: "/", icon: <FiHome />, label: "Home" },
              { href: "/admin/manage-users", icon: <FiUsers />, label: "Users" },
              { href: "/admin/appointments", icon: <FiCalendar />, label: "Appointments" },
              { href: "/admin/doctors", icon: <FiUserPlus />, label: "Doctors" },
              { href: "/admin/time-slots", icon: <FiClock />, label: "Time Slots" },
              { href: "/admin/reviews", icon: <FiStar />, label: "Reviews" },
              { href: "/admin/settings", icon: <FiSettings />, label: "Settings" },
            ].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    flex items-center p-3 rounded-lg
                    text-gray-300 hover:bg-gray-700 hover:text-white
                    transition-colors duration-200
                    ${sidebarOpen ? 'justify-start' : 'justify-center'}
                  `}
                >
                  <span className="text-xl">{item.icon}</span>
                  {sidebarOpen && <span className="ml-3">{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={() => signOut()}
            className={`
              w-full flex items-center p-3 rounded-lg
              text-gray-300 hover:bg-gray-700 hover:text-white
              transition-colors duration-200
              ${sidebarOpen ? 'justify-start' : 'justify-center'}
            `}
          >
            <HiOutlineLogout className="text-xl" />
            {sidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </div>
    </div>
  );
}