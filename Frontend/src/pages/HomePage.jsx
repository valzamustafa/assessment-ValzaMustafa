const HomePage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Video Annotation Platform
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Upload videos, create annotations and bookmarks
      </p>
      <div className="flex justify-center space-x-4">
        <a href="/login" className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600">
          Login
        </a>
        <a href="/register" className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
          Register
        </a>
      </div>
    </div>
  )
}
export default HomePage