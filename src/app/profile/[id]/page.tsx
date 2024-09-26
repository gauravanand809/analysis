export default function UserProfile({ params }: any) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 py-6">
      <div className="bg-white/60 backdrop-blur-md shadow-2xl rounded-lg p-10 max-w-md w-full text-center transition-all duration-300 transform hover:scale-105 hover:bg-white/70">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
          User Profile
        </h1>
        <hr className="mb-6 border-gray-300" />

        <p className="text-xl text-gray-800">
          Welcome to your profile,{" "}
          <span className="ml-2 p-2 bg-orange-500 text-white rounded-full shadow-lg inline-block">
            {params.id}
          </span>
        </p>

        <p className="text-gray-600 mt-4">
          Manage your account and personalize your experience here.
        </p>
      </div>
    </div>
  );
}
