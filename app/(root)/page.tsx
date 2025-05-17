import Image from "next/image";
import Link from "next/link";
import { db } from "@/db/drizzle";
import { specialties } from "@/db/schema";

import { healthBlogs } from "@/blogs";

import {
  IoCallOutline,
  IoSearchOutline,
  IoCalendarOutline,
  IoMedkitOutline,
} from "react-icons/io5";

export default async function Home() {
  const allSpecialties = await db.select().from(specialties);

  const blogs = healthBlogs;
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section id="hero" className="relative h-screen w-full">
        <div className="absolute inset-0 bg-black/50 dark:bg-black/70 z-10" />
        <Image
          src={"/hero.png"}
          fill
          priority
          alt="Doctor and patient"
          className="object-cover"
        />
        <div className="container relative z-20 h-full flex items-center px-4 md:px-10 lg:px-20">
          <div className="max-w-2xl space-y-6 text-white">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Your Health Journey <br />
              <span className="text-blue-400">Starts Here</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300">
              Connect with top specialists and book appointments effortlessly.
              Your wellness is just a click away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                href="/doctors"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300 text-center shadow-lg hover:shadow-blue-500/20"
              >
                Book An Appointment
              </Link>
              <Link
                href="/contact"
                className="flex items-center justify-center gap-2 bg-transparent border-2 border-white hover:bg-white/10 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-300"
              >
                <IoCallOutline className="text-xl" />
                Emergency Call
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container max-w-4xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simple Steps to Better Health
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Our streamlined process makes it easy to get the care you need,
              when you need it.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <IoSearchOutline className="text-blue-600 dark:text-blue-400 text-2xl" />
                <span className="absolute -mt-12 -mr-12 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  1
                </span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                Find Your Doctor
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Search by specialty, location, or availability to find the
                perfect healthcare provider.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <IoCalendarOutline className="text-blue-600 dark:text-blue-400 text-2xl" />
                <span className="absolute -mt-12 -mr-12 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  2
                </span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                Book Appointment
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Select your preferred date and time with our real-time
                scheduling system.
              </p>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                <IoMedkitOutline className="text-blue-600 dark:text-blue-400 text-2xl" />
                <span className="absolute -mt-12 -mr-12 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  3
                </span>
              </div>
              <h3 className="text-xl font-semibold text-center mb-2">
                Receive Care
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-center">
                Attend your appointment and get personalized healthcare tailored
                to your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section id="specialties" className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Our <span className="text-blue-600">Specialty</span> Departments
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Access to specialized care across various medical disciplines.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allSpecialties.map((specialty) => (
              <Link
                href={`/specialties/${specialty.id}`}
                key={specialty.id}
                className="group bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl p-6 transition-all duration-300 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
              >
                <div className="flex justify-center mb-4">
                  <div className="w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors duration-300">
                    {specialty.icon_url ? (
                      <Image
                        src={specialty.icon_url}
                        width={40}
                        height={40}
                        alt={specialty.specialty}
                        className="object-contain"
                      />
                    ) : (
                      <span className="text-2xl">⚕️</span>
                    )}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-center mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                  {specialty.specialty}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                  {specialty.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 dark:bg-blue-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-blue-100 dark:text-blue-200">
            Join thousands of patients who&#39;ve found their perfect doctor
            through our platform.
          </p>
          <Link
            href="/appointments"
            className="inline-block bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors duration-300 shadow-lg"
          >
            Find a Doctor Now
          </Link>
        </div>
      </section>

      {/* blogs section */}
      <section id="blogs" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Latest{" "}
            <span className="text-blue-600 dark:text-blue-400">Blogs</span>
          </h2>

          <div className="relative">
            {/* Horizontal Scroll Container */}
            <div className="overflow-x-auto pb-6 scrollbar-hide">
              <div className="flex space-x-6 w-max">
                {blogs.map((blog) => (
                  <div
                    key={blog.id}
                    className="flex-shrink-0 w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
                  >
                    <Link href={`/blogs/${blog.id}`} className="block">
                      {/* Blog Image */}
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={blog.image}
                          alt={blog.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                        />
                      </div>

                      {/* Blog Content */}
                      <div className="p-5">
                        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 mb-2">
                          {blog.category}
                        </span>
                        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 line-clamp-2">
                          {blog.title}
                        </h3>
                        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
                          <span>
                            {new Date().toLocaleDateString()}
                          </span>
                          <span className="mx-2">•</span>
                          <span>{Math.floor(Math.random() * 6)} min read</span>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Gradient Fade (optional) */}
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-gray-50 to-transparent dark:from-gray-900 pointer-events-none"></div>
          </div>

          {/* View All Button (centered below scroll) */}
          <div className="text-center mt-8">
            <Link
              href="/blogs"
              className="inline-flex items-center px-6 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors duration-300"
            >
              View All Articles
              <svg
                className="w-4 h-4 ml-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
