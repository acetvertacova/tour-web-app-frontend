import { Link } from "react-router-dom";
import { MapPin, Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-50 to-green-100/50 p-6">
            <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-md shadow-sm border border-green-100/50 p-12 rounded-2xl mx-auto w-full max-w-lg">
                {/* Logo similar to header */}
                <div className="flex items-center space-x-2 mb-8">
                    <div className="bg-green-600 p-3 rounded-full shadow-sm">
                        <MapPin className="h-8 w-8 text-white" />
                    </div>
                    <span className="text-3xl font-light text-green-900 tracking-tight">Wonder</span>
                </div>

                {/* 404 Content */}
                <h1 className="text-6xl font-light text-green-900 mb-4 tracking-tight">404</h1>
                <p className="text-xl text-green-700 mb-2 font-light">Page not found</p>
                <p className="text-green-600 mb-8 text-center font-light">
                    The page you're looking for doesn't exist or has been moved.
                </p>

                {/* Back to Home Button - styled like header buttons */}
                <Link
                    to="/"
                    className="flex items-center space-x-2 px-8 py-3 rounded-full bg-green-600 text-white hover:bg-green-700 transition-all duration-300 font-light tracking-wide shadow-sm hover:shadow-md"
                >
                    <Home className="h-4 w-4" />
                    <span>Back to Home</span>
                </Link>
            </div>
        </div>
    );
}