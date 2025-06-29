import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import * as tourApi from "../../api/tour/tour";
import { bookTour } from "../../store/booking/actions";

export default function Booking() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { loading, error, success } = useSelector(state => state.booking);
    const { userInfo } = useSelector(state => state.auth);

    const [tour, setTour] = useState(null);
    const [seats, setSeats] = useState(1);
    const [localError, setLocalError] = useState('');

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const data = await tourApi.getTourById(id);
                setTour(data);
            } catch {
                setLocalError('Failed to load tour info');
            }
        };
        fetchTour();
    }, [id]);

    const handleBook = () => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        if (seats < 1 || seats > tour.availableSpots) {
            setLocalError(`Please select between 1 and ${tour.availableSpots} seats`);
            return;
        }
        setLocalError('');
        dispatch(bookTour({ tourId: id, seatsBooked: seats }));
    };

    if (!tour) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="flex justify-center items-center">
                    <div className="text-lg">Loading tour info...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        Book Tour: {tour.name}
                    </h1>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>{tour.city}, {tour.country}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            <span>Available spots: {tour.availableSpots}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span className="text-xl font-semibold text-green-600">
                                ${tour.price} per person
                            </span>
                        </div>
                    </div>

                    <div className="border-t pt-6">
                        <label className="block mb-4">
                            <span className="text-gray-700 font-medium mb-2 block">
                                Select number of seats:
                            </span>
                            <input
                                type="number"
                                min={1}
                                max={tour.availableSpots}
                                value={seats}
                                onChange={e => setSeats(Number(e.target.value))}
                                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </label>

                        <div className="mb-4">
                            <div className="text-lg font-semibold text-gray-800">
                                Total: ${tour.price * seats}
                            </div>
                        </div>

                        <button
                            onClick={handleBook}
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200 font-medium"
                        >
                            {loading ? 'Booking...' : 'Book Now'}
                        </button>

                        {(localError || error) && (
                            <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md">
                                {localError || error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}