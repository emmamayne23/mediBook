import Link from "next/link";
import Image from "next/image";
import { FaCalendarAlt, FaClock, FaArrowRight } from "react-icons/fa";
import { healthBlogs } from "@/blogs";

export default function BlogsPage() {
    const blogs = healthBlogs;
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Our <span className="text-blue-600 dark:text-blue-400">Blog</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Insights, news and updates from the healthcare industry
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogs.map((blog) => (
            <article 
              key={blog.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden"
            >
              <Link href={`/blogs/${blog.id}`} className="block">
                <div className="relative h-60 overflow-hidden">
                  <Image
                    src={blog.image}
                    alt={blog.title}
                    fill
                    className="object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center mb-3 md:gap-10">
                    <span className="px-3 py-1 text-center text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
                      {blog.category}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {blog.publisherName}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 line-clamp-2">
                    {blog.title}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
                    {blog.description}
                  </p>
                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <FaCalendarAlt />
                      <span>{new Date().toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FaClock />
                      <span>{Math.floor(Math.random() * 6)} min read</span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        {/* Pagination would go here */}
        <div className="mt-16 flex justify-center">
          <button className="px-6 py-2 border border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 rounded-full hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-colors duration-300 flex items-center gap-2">
            Load More
            <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
}