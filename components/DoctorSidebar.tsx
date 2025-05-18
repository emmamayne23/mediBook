import Link from 'next/link';
import { 
  FaUserMd, 
  FaTachometerAlt, 
  FaHome, 
  FaCalendarAlt, 
  FaStar, 
  FaClock, 
//   FaEdit,
  FaSignOutAlt 
} from 'react-icons/fa';

export default function DoctorSidebar() {
  return (
    <div className="fixed left-0 top-0 h-full w-16 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col z-50">
      {/* Logo/App Icon */}
      <div className="flex justify-center py-5 border-b border-gray-200 dark:border-gray-700">
        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <FaUserMd className="text-blue-500 dark:text-blue-400 text-xl" />
        </div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex-1 flex flex-col items-center py-4 space-y-6">
        <SidebarIcon 
          icon={<FaTachometerAlt className="text-xl" />} 
          tooltip="Dashboard" 
          href={""}
        />
        <SidebarIcon 
          icon={<FaHome className="text-xl" />} 
          tooltip="Home" 
          href={"/"}
        />
        <SidebarIcon 
          icon={<FaCalendarAlt className="text-xl" />} 
          tooltip="Appointments" 
          href={"/dashboard/doctor/appointments"}
        />
        <SidebarIcon 
          icon={<FaStar className="text-xl" />} 
          tooltip="Reviews" 
          href={"/dashboard/doctor/reviews"}
        />
        <SidebarIcon 
          icon={<FaClock className="text-xl" />} 
          tooltip="Slots" 
          href={"#slots"}
        />
      </nav>

      {/* Logout Button */}
      <div className="py-4 border-t border-gray-200 dark:border-gray-700 flex justify-center">
        <SidebarIcon 
          icon={<FaSignOutAlt className="text-xl" />} 
          tooltip="Logout" 
          href="#logout"
        />
      </div>
    </div>
  );
}

// Reusable sidebar icon component
function SidebarIcon({ icon, tooltip, href }: { icon: React.ReactNode, tooltip: string, href: string }) {
  return (
    <Link
      href={href}
      className="p-3 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all relative group"
    >
      {icon}
      <span className="absolute left-full ml-4 px-2 py-1 bg-gray-800 dark:bg-gray-700 text-white text-xs rounded hidden group-hover:block transition whitespace-nowrap">
        {tooltip}
      </span>
    </Link>
  );
}