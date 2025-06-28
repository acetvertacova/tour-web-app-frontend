import { useEffect, useRef, useState } from 'react';
import * as tourApi from '../../api/tour/tour';
import * as commentApi from '../../api/comment/comment';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { MapPin, Calendar, Users, Star, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { toast } from 'react-toastify';
import UndoNotification from '../UndoNotification';

export default function TourDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { userInfo } = useSelector((state) => state.auth);
    const [tour, setTour] = useState(null);
    const [comments, setComments] = useState([]);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [editingContent, setEditingContent] = useState('');
    const toastId = useRef(null);

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [currentImage, setCurrentImage] = useState(0);

    useEffect(() => {
        const fetchTourAndComments = async () => {
            try {
                const tourData = await tourApi.getTourById(id);
                setTour(tourData);

                const commentsData = await commentApi.getCommentsByTourId(id);
                setComments(commentsData);
            } catch (err) {
                setError(err.response?.data || 'Failed to load tour details');
            } finally {
                setLoading(false);
            }
        };

        fetchTourAndComments();
    }, [id]);

    useEffect(() => {
        if (!tour?.imagesUrl?.length) return;

        const interval = setInterval(() => {
            setCurrentImage((prev) => (prev + 1) % tour.imagesUrl.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [tour]);

    const handleAddComment = async () => {
        if (!newCommentContent.trim()) return;
        try {
            const newComment = await commentApi.createComment({
                tourId: id,
                content: newCommentContent,
                username: userInfo.sub,
            });
            setComments([...comments, newComment]);
            setNewCommentContent('');
        } catch (error) {
            alert(error.response?.data || "Please log in to add a comment!");
        }
    };

    const handleStartEditing = (comment) => {
        setEditingCommentId(comment.id);
        setEditingContent(comment.content);
    };

    const handleCancelEditing = () => {
        setEditingCommentId(null);
        setEditingContent('');
    };

    const handleSaveEditing = async () => {
        try {
            const updatedComment = await commentApi.updateComment(editingCommentId, {
                content: editingContent,
            });
            setComments(comments.map(c => c.id === editingCommentId ? updatedComment : c));
            setEditingCommentId(null);
            setEditingContent('');
        } catch (error) {
            alert(error.response?.data || "Failed to update comment");
        }
    };

    const handleDeleteComment = (commentId) => {
        const deletedComment = comments.find((c) => c.id === commentId);
        if (!deletedComment) return;

        // delete from ui! not backend
        setComments((prev) => prev.filter((c) => c.id !== commentId));

        // show undo notification
        toastId.current = toast.info(
            ({ closeToast }) => <UndoNotification closeToast={closeToast} />,
            {
                draggable: true,
                autoClose: 3000,
                onClose: async (rejected) => {
                    if (rejected) {
                        toast.info("Cancelled!", { autoClose: 2000 });
                        setComments((prev) => [...prev, deletedComment]);
                        return;
                    }
                    try {
                        await commentApi.deleteComment(commentId);
                        toast.success("Comment is deleted!", { autoClose: 2000 });
                    } catch (err) {
                        const msg = err?.response?.data || "Could not delete comment!";
                        toast.error(msg);
                        // reborn if error
                        setComments(prev => [...prev, deletedComment].sort((a, b) => a.id - b.id));
                    }
                },
            }
        );
    };

    const handlePrev = () => {
        if (tour?.imagesUrl?.length) {
            setCurrentImage((prev) => (prev - 1 + tour.imagesUrl.length) % tour.imagesUrl.length);
        }
    };

    const handleNext = () => {
        if (tour?.imagesUrl?.length) {
            setCurrentImage((prev) => (prev + 1) % tour.imagesUrl.length);
        }
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`h-4 w-4 ${index < rating
                    ? 'text-emerald-400 fill-current'
                    : 'text-green-200'
                    }`}
                strokeWidth={1}
            />
        ));
    };

    const getDuration = (checkIn, checkOut) => {
        const start = new Date(checkIn);
        const end = new Date(checkOut);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <div className="relative">
                        <div className="h-12 w-12 rounded-full border border-green-200"></div>
                        <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-t-2 border-emerald-500 animate-spin"></div>
                    </div>
                    <p className="mt-4 text-green-600 font-light">Loading tour details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md">
                    <div className="bg-red-50 border border-red-100 rounded-lg p-6 mb-6">
                        <h3 className="text-red-800 font-medium mb-2">Error</h3>
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                        Go Back Home
                    </button>
                </div>
            </div>
        );
    }

    if (!tour) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <h3 className="text-xl font-light text-green-800 mb-2">No tour found</h3>
                    <button
                        onClick={() => navigate('/')}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                        Browse Tours
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="border-b border-green-100">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <button
                        onClick={() => navigate('/')}
                        className="flex items-center text-green-600 hover:text-emerald-600 transition-colors duration-200 mb-4"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" strokeWidth={1.5} />
                        <span className="font-light">Back to Tours</span>
                    </button>

                    <div className="mb-4">
                        <h1 className="text-4xl lg:text-5xl font-light text-green-900 mb-4 leading-tight">
                            {tour.name}
                        </h1>
                        <div className="flex items-center text-green-600 mb-4">
                            <MapPin className="h-5 w-5 mr-2 text-emerald-500" strokeWidth={1.5} />
                            <span className="text-lg font-light">{tour.city}, {tour.country}</span>
                        </div>
                        <div className="w-20 h-px bg-emerald-300"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-12">
                {/* Image Gallery */}
                {tour.imagesUrl?.length > 0 && (
                    <div className="mb-16">
                        <div className="relative h-96 lg:h-[500px] rounded-lg overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 mb-4">
                            <img
                                src={tour.imagesUrl[currentImage]}
                                alt={`Tour image ${currentImage + 1}`}
                                className="w-full h-full object-cover"
                            />

                            {tour.imagesUrl.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200"
                                    >
                                        <ChevronLeft className="h-5 w-5 text-green-900" strokeWidth={1.5} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors duration-200"
                                    >
                                        <ChevronRight className="h-5 w-5 text-green-900" strokeWidth={1.5} />
                                    </button>
                                </>
                            )}

                            {/* Image indicators */}
                            {tour.imagesUrl.length > 1 && (
                                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                                    {tour.imagesUrl.map((_, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setCurrentImage(index)}
                                            className={`w-2 h-2 rounded-full transition-colors duration-200 ${index === currentImage ? 'bg-white' : 'bg-white/50'
                                                }`}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Tour Information Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
                    {/* Main Details */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Overview */}
                        <div>
                            <h2 className="text-2xl font-light text-green-900 mb-4">Overview</h2>
                            <div className="w-16 h-px bg-emerald-300 mb-6"></div>
                            <p className="text-green-700 leading-relaxed font-light text-lg">
                                {tour.description}
                            </p>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Price & Booking */}
                        <div className="bg-green-50 rounded-lg p-6">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-light text-green-900 mb-2">
                                    ${tour.price}
                                </div>
                                <div className="text-green-600 font-light">per person</div>
                            </div>

                            <button
                                onClick={() => navigate(`/booking/${tour.id}`)}
                                className="w-full bg-emerald-600 text-white py-4 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-lg"
                            >
                                Book This Tour
                            </button>
                        </div>

                        {/* Tour Details */}
                        <div className="space-y-6">
                            <div>
                                <div className="text-sm text-green-600 font-light mb-2">Hotel</div>
                                <div className="text-green-900 font-medium">{tour.hotel}</div>
                                <div className="flex items-center mt-2">
                                    {renderStars(tour.rating)}
                                    <span className="text-sm text-green-600 ml-2">({tour.rating})</span>
                                </div>
                            </div>

                            <div className="border-t border-green-100 pt-6">
                                <div className="text-sm text-green-600 font-light mb-2">Duration</div>
                                <div className="flex items-center text-green-900 mb-2">
                                    <Calendar className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={1.5} />
                                    <span className="font-light text-sm">{tour.checkInDate} - {tour.checkOutDate}</span>
                                </div>
                                <div className="text-emerald-600 font-medium">
                                    {getDuration(tour.checkInDate, tour.checkOutDate)} days
                                </div>
                            </div>

                            <div className="border-t border-green-100 pt-6">
                                <div className="text-sm text-green-600 font-light mb-2">Availability</div>
                                <div className="flex items-center text-green-900">
                                    <Users className="h-4 w-4 mr-2 text-emerald-500" strokeWidth={1.5} />
                                    <span className="font-medium">{tour.availableSpots}</span>
                                    <span className="text-green-600 font-light ml-1">of {tour.maxCapacity} spots</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Comments Section */}
                <div className="border-t border-green-100 pt-12">
                    <h2 className="text-2xl font-light text-green-900 mb-4">Reviews & Comments</h2>
                    <div className="w-16 h-px bg-emerald-300 mb-8"></div>

                    {/* Add Comment */}
                    <div className="bg-green-50 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-light text-green-900 mb-4">Share Your Experience</h3>
                        <textarea
                            placeholder="Write your review or comment..."
                            value={newCommentContent}
                            onChange={e => setNewCommentContent(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 placeholder-green-400 resize-none"
                        />
                        <button
                            onClick={handleAddComment}
                            disabled={!newCommentContent.trim()}
                            className="mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Add Comment
                        </button>
                    </div>

                    {/* Comments List */}
                    <div className="space-y-6">
                        {comments.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-green-600 font-light">No comments yet. Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            [...comments]
                                .sort((a, b) => a.id - b.id)
                                .map((comment) => (
                                    <div key={comment.id} className="border-b border-green-100 pb-6 last:border-b-0">
                                        <div className="flex items-center justify-between mb-3">
                                            <div className="font-medium text-green-900">{comment.username}</div>
                                            <div className="text-xs text-green-500 font-light">
                                                {new Date(comment.createdAt).toLocaleDateString()}
                                            </div>
                                        </div>

                                        {editingCommentId === comment.id ? (
                                            <div className="space-y-3">
                                                <textarea
                                                    value={editingContent}
                                                    onChange={e => setEditingContent(e.target.value)}
                                                    rows={3}
                                                    className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 resize-none"
                                                />
                                                <div className="flex gap-3">
                                                    <button
                                                        onClick={handleSaveEditing}
                                                        className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        onClick={handleCancelEditing}
                                                        className="px-4 py-2 text-green-600 border border-green-200 rounded-lg hover:bg-green-50 transition-colors duration-200 font-medium text-sm"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="text-green-700 font-light leading-relaxed mb-3">{comment.content}</p>
                                                {comment.username === userInfo.sub && (
                                                    <div className="flex gap-3">
                                                        <button
                                                            onClick={() => handleStartEditing(comment)}
                                                            className="text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors duration-200"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="text-red-600 hover:text-red-700 font-medium text-sm transition-colors duration-200"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}