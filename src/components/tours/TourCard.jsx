import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Users, Star } from 'lucide-react';
import { useSelector } from "react-redux";

export default function TourCard({ tour, onDelete }) {
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);

    const getDuration = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-3 w-3 ${index < rating
                    ? 'text-emerald-400 fill-current'
                    : 'text-green-200'
                    }`}
                strokeWidth={1}
            />
        ));
    }

    return (
        <div className="group">
            {/* Main Card Container */}
            <div className="bg-white hover:bg-green-50/30 transition-all duration-300 rounded-lg p-8 border-b border-green-100">
                <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-12">

                    {/* Image Section */}
                    <div className="lg:w-80 lg:flex-shrink-0 mb-6 lg:mb-0">
                        <div className="relative h-48 lg:h-56 overflow-hidden rounded-lg bg-gradient-to-br from-green-50 to-emerald-50">
                            <img
                                src={tour.imagesUrl && tour.imagesUrl.length > 0 ? tour.imagesUrl[0] : 'placeholder.jpg'}
                                alt={tour.name}
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                            />
                            {/* Subtle price overlay */}
                            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-3 py-1 rounded-full">
                                <span className="text-green-900 font-medium text-sm">${tour.price}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                        {/* Header */}
                        <div className="mb-6">
                            <h3 className="text-2xl lg:text-3xl font-light text-green-900 mb-3 leading-tight">
                                {tour.name}
                            </h3>
                            <div className="flex items-center text-green-600 mb-4">
                                <MapPin className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={1.5} />
                                <span className="text-base font-light">{tour.city}, {tour.country}</span>
                            </div>
                            {/* Thin separator line */}
                            <div className="w-16 h-px bg-emerald-300"></div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* Hotel & Rating */}
                            <div className="space-y-2">
                                <div className="text-sm text-green-600 font-light">Hotel</div>
                                <div className="text-green-900 font-medium">{tour.hotel}</div>
                                <div className="flex items-center space-x-1">
                                    {renderStars(tour.rating)}
                                    <span className="text-xs text-green-600 ml-2">({tour.rating})</span>
                                </div>
                            </div>

                            {/* Availability */}
                            <div className="space-y-2">
                                <div className="text-sm text-green-600 font-light">Availability</div>
                                <div className="flex items-center text-green-900">
                                    <Users className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={1.5} />
                                    <span className="font-medium">{tour.availableSpots}</span>
                                    <span className="text-green-600 font-light ml-1">of {tour.maxCapacity} spots</span>
                                </div>
                            </div>

                            {/* Duration */}
                            <div className="space-y-2 md:col-span-2">
                                <div className="text-sm text-green-600 font-light">Duration</div>
                                <div className="flex items-center text-green-900">
                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={1.5} />
                                    <span className="font-light">{tour.checkInDate} - {tour.checkOutDate}</span>
                                    <span className="ml-4 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-sm font-medium">
                                        {getDuration(tour.checkInDate, tour.checkOutDate)} days
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => navigate(`/tours/${tour.id}`)}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
                            >
                                View Details
                            </button>

                            {userInfo.scope === "ADMIN" && (
                                <>
                                    <button
                                        onClick={() => navigate(`/form/${tour.id}/edit`)}
                                        className="px-6 py-3 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors duration-200 font-medium text-sm"
                                    >
                                        Edit Tour
                                    </button>
                                    <button
                                        onClick={() => onDelete(tour.id)}
                                        className="px-6 py-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200 font-medium text-sm"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}