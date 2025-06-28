import { useEffect, useRef, useState } from "react";
import * as api from '../../api/tour/tour';
import TourCard from "./TourCard";
import TourSearch from "./TourSearch";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import UndoNotification from '../UndoNotification';
import { toast } from 'react-toastify';

export default function Tours() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const toastId = useRef(null);

    const handleDelete = (id) => {
        const deletedTour = tours.find((t) => t.id === id);
        if (!deletedTour) return;

        // delete from ui! not backend
        setTours((prev) => prev.filter((t) => t.id !== id));

        // show undo notification
        toastId.current = toast.info(
            ({ closeToast }) => <UndoNotification closeToast={closeToast} />,
            {
                draggable: true,
                autoClose: 3000,
                onClose: async (rejected) => {
                    if (rejected) {
                        toast.info("Cancelled!", { autoClose: 2000 });
                        setTours((prev) => [...prev, deletedTour]);
                        return;
                    }
                    try {
                        await api.deleteTour(id);
                        toast.success("Tour was deleted!", { autoClose: 2000 });
                    } catch (err) {
                        const msg = err?.response?.data || "Could not delete tour!";
                        toast.error(msg);
                        // reborn if error
                        setTours(prev => [...prev, deletedTour].sort((a, b) => a.id - b.id));
                    }
                },
            }
        );
    };

    const handleSearch = async (searchParams) => {
        try {
            setLoading(true);
            setError(null);
            const filtered = await api.filterToursByMultiParam(searchParams);
            setTours(filtered);
        } catch (err) {
            setError(err.message || 'Search failed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        setError(null);
        const fetchTours = async () => {
            try {
                const data = await api.getTours();
                setTours(data);
            } catch (error) {
                console.error('An error loading:', error);
                setError(error.message || 'Failed to load tours. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section - Minimalist */}
            <div className="relative h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
                <img
                    src="https://images.unsplash.com/photo-1506012787146-f92b2d7d6d96?q=80&w=1469&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Hero-image-plane"
                    className="absolute inset-0 h-full w-full object-cover opacity-20"
                />

                <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
                    <div className="text-center max-w-4xl">
                        <h1 className="text-5xl md:text-7xl font-light text-green-900 mb-8 leading-tight tracking-tight">
                            Discover
                            <span className="block text-emerald-600 font-normal">the World</span>
                        </h1>
                        <p className="text-xl text-green-700 mb-12 font-light max-w-2xl mx-auto leading-relaxed">
                            Curated adventures and exclusive experiences across the globe
                        </p>
                        <a
                            href="#tours"
                            className="inline-flex items-center px-8 py-4 text-green-900 border border-green-200 rounded-full hover:bg-green-50 transition-all duration-300 font-medium tracking-wide"
                        >
                            Explore Tours
                            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div id="tours" className="bg-white py-20">
                <div className="max-w-6xl mx-auto px-6">
                    {/* Header */}
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-light text-green-900 mb-4">
                            Available Tours
                        </h2>
                        <div className="w-20 h-px bg-emerald-300 mx-auto"></div>
                    </div>

                    {/* Loading State */}
                    {loading && (
                        <div className="flex justify-center items-center py-24">
                            <div className="flex flex-col items-center">
                                <div className="relative">
                                    <div className="h-12 w-12 rounded-full border border-green-200"></div>
                                    <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                                </div>
                                <p className="mt-4 text-green-600 font-light">Loading tours...</p>
                            </div>
                        </div>
                    )}

                    {/* Error State */}
                    {error && (
                        <div className="max-w-md mx-auto mb-12">
                            <div className="bg-red-50 border border-red-100 rounded-lg p-6">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-red-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-red-800 font-medium text-sm">Error</h3>
                                        <p className="text-red-600 text-sm mt-1 leading-relaxed">{error}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Search Component */}
                    <div className="mb-16">
                        <TourSearch onSearch={handleSearch} />
                    </div>

                    {/* Admin Controls */}
                    {userInfo.scope === "ADMIN" && (
                        <div className="mb-12 flex justify-end">
                            <button
                                onClick={() => navigate('/form/create')}
                                className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
                            >
                                Create New Tour
                            </button>
                        </div>
                    )}

                    {/* No Tours Message */}
                    {!loading && !error && tours.length === 0 && (
                        <div className="text-center py-24">
                            <div className="max-w-md mx-auto">
                                <svg className="h-16 w-16 text-green-200 mx-auto mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <h3 className="text-xl font-light text-green-800 mb-2">No tours found</h3>
                                <p className="text-green-600 text-sm">Try adjusting your search criteria</p>
                            </div>
                        </div>
                    )}

                    {/* Tours Grid */}
                    {!loading && !error && tours.length > 0 && (
                        <div className="space-y-6">
                            {[...tours]
                                .sort((a, b) => a.id - b.id) // sort copy
                                .map((tour) => (
                                    <div
                                        key={tour.id}
                                        className="border-b border-green-100 last:border-b-0 pb-6 last:pb-0"
                                    >
                                        <TourCard tour={tour} onDelete={handleDelete} />
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}