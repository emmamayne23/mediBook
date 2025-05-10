import { notFound } from "next/navigation";
import Image from "next/image";
import { FaCalendarAlt, FaClock, FaUserEdit, FaArrowLeft } from "react-icons/fa";
import Link from "next/link";
import { healthBlogs } from "@/blogs";


const getBlogPost = (id: string) => {
  return healthBlogs.find((blog) => blog.id === id);
};

export default function BlogDetailPage({ params }: { params: { id: string } }) {
  const blog = getBlogPost(parseInt(params.id));

  if (!blog) {
    return notFound();
  }


  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <article className="container mx-auto px-4 py-16 max-w-4xl">
        <Link 
          href="/blogs" 
          className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline mb-8"
        >
          <FaArrowLeft />
          Back to all articles
        </Link>

        <div className="mb-8">
          <span className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200">
            {blog.category}
          </span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
          {blog.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-8">
          <div className="flex items-center gap-2">
            <FaUserEdit />
            <span>{blog.publisherName}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaCalendarAlt />
            <span>{new Date().toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaClock />
            <span>{Math.floor(Math.random() * 6)} min read</span>
          </div>
        </div>

        <div className="relative h-96 rounded-xl overflow-hidden mb-10">
          <Image
            src={blog.image}
            alt={blog.title}
            fill
            className="object-cover"
          />
        </div>

        <div 
          className="prose dark:prose-invert max-w-none"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />

        <div className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">
            About the Author
          </h2>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
              {/* Author image would go here */}
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">{blog.publisherName}</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                Healthcare professional with 10+ years of experience in telemedicine solutions.
              </p>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
}