import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-gray-900 text-center px-4">
      <h2 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-4">
        404 - Not Found
      </h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Sorry, the page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        href="/"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors duration-200"
      >
        Return Home
      </Link>
    </div>
  )
}
