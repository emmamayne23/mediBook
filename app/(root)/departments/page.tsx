import { specialties } from "@/db/schema";
import { db } from "@/db/drizzle";
import Image from "next/image";
import Link from "next/link";
import { FaStethoscope, FaArrowRight } from "react-icons/fa";

export default async function SpecialtiesPage() {
  const allSpecialties = await db.select().from(specialties);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-700 dark:to-blue-800 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 flex items-center justify-center gap-3">
            <FaStethoscope className="text-4xl" />
            Our Medical Specialties
          </h1>
          <p className="text-xl max-w-3xl mx-auto opacity-90">
            Explore our comprehensive range of specialized healthcare services
          </p>
        </div>
      </section>

      {/* Specialties Grid */}
      <section className="py-16 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-3">
            Expert Care Across All Specialties
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Our specialists are dedicated to providing exceptional care in their respective fields
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {allSpecialties.map((specialty) => (
            <Link
              href={`/specialties/${specialty.id}`}
              key={specialty.id}
              className="group bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
            >
              {/* Specialty Icon */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 p-8 flex justify-center">
                <div className="w-24 h-24 bg-white dark:bg-gray-700 rounded-full flex items-center justify-center shadow-inner group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                  {specialty.icon_url ? (
                    <Image
                      src={specialty.icon_url}
                      width={48}
                      height={48}
                      alt={specialty.specialty}
                      className="object-contain"
                    />
                  ) : (
                    <FaStethoscope className="text-3xl text-blue-500 dark:text-blue-400" />
                  )}
                </div>
              </div>

              {/* Specialty Content */}
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {specialty.specialty}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                  {specialty.description}
                </p>
                <div className="flex items-center justify-center text-blue-600 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-sm font-medium">View Specialists</span>
                  <FaArrowRight className="ml-2" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            Can&apos;t find what you&apos;re looking for?
          </h3>
          <Link
            href="/contact"
            className="inline-flex items-center px-6 py-3 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors duration-300"
          >
            Contact Our Support Team
            <FaArrowRight className="ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
}