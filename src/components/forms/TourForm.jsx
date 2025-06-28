import { useNavigate, useParams } from 'react-router-dom';
import * as api from '../../api/tour/tour';
import tourSchema from '../../validation/tour.schema';
import { useFieldArray, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useEffect, useRef, useState } from 'react';
import { format } from 'date-fns';
import UndoNotification from '../UndoNotification';
import { toast } from 'react-toastify';
import { MapPin, Calendar, Users, Star, Image, Trash2, Plus, Activity } from 'lucide-react';

export default function TourForm() {
    const { id } = useParams();
    const toastId = useRef(null);

    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(tourSchema),
        mode: "onChange",
    });

    const { fields: imagesFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: "imagesUrl",
    });

    const formatDate = (date) => {
        if (!date) return null;
        return format(new Date(date), 'dd-MMM-yyyy');
    };

    const formatDateForInput = (date) => {
        if (!date) return null;
        return format(new Date(date), 'yyyy-MM-dd');
    };

    useEffect(() => {
        if (id) {
            const fetchTour = async () => {
                const data = await api.getTourById(id);
                console.log(data);
                reset({
                    imagesUrl: data.imagesUrl || [],
                    name: data.name,
                    country: data.country,
                    city: data.city,
                    price: data.price,
                    hotel: data.hotel,
                    maxCapacity: data.maxCapacity,
                    availableSpots: data.availableSpots,
                    checkInDate: formatDateForInput(data.checkInDate),
                    checkOutDate: formatDateForInput(data.checkOutDate),
                    rating: data.rating,
                    description: data.description,
                });
            };
            fetchTour();
        }
    }, [id, reset]);

    const onSubmit = async (data) => {
        const formattedData = {
            ...data,
            checkInDate: formatDate(data.checkInDate),
            checkOutDate: formatDate(data.checkOutDate),
        };

        try {
            if (id) {
                await api.updateTour(id, formattedData);
                toast.success("Tour updated successfully!", {
                    autoClose: 1000,
                });
            } else {
                toastId.current = toast.info(
                    ({ closeToast }) => <UndoNotification closeToast={closeToast} />,
                    {
                        draggable: true,
                        autoClose: 2000,
                        onClose: async (rejected) => {
                            if (rejected) {
                                toast.info("Tour creation cancelled", {
                                    type: "info",
                                    autoClose: 2000,
                                });
                                return;
                            }
                            try {
                                await api.createTour(formattedData);
                                toast.success("Tour created successfully!", {
                                    autoClose: 2000,
                                });
                                reset();
                            } catch (err) {
                                const msg = err?.response?.data || "Failed to create tour.";
                                toast.error(msg);
                            }
                        },
                    }
                );
            }
        } catch (err) {
            const errorMsg = err?.response?.data || "An unexpected error occurred";
            toast.error(errorMsg);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg border-b border-green-100 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-light text-green-900 mb-3 leading-tight">
                        {id ? 'Edit Tour' : 'Create New Tour'}
                    </h1>
                    <div className="w-16 h-px bg-emerald-300"></div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">

                    {/* Images Section */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 mb-4">
                            <Image className="h-5 w-5 text-emerald-500" strokeWidth={1.5} />
                            <h3 className="text-lg font-medium text-green-900">Tour Images</h3>
                        </div>

                        <div className="space-y-3">
                            {imagesFields.map((field, index) => (
                                <div key={field.id} className="flex items-center space-x-3">
                                    <input
                                        className="flex-1 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                        placeholder="Enter image URL"
                                        {...register(`imagesUrl.${index}`)}
                                        defaultValue={field.value}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(index)}
                                        className="p-3 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors duration-200"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                    {errors.imagesUrl && errors.imagesUrl[index] && (
                                        <p className="text-red-600 text-sm font-light">{errors.imagesUrl[index].message}</p>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => appendImage("")}
                                className="flex items-center space-x-2 px-4 py-2 text-emerald-600 border border-emerald-200 rounded-lg hover:bg-emerald-50 transition-colors duration-200 font-medium text-sm"
                            >
                                <Plus className="h-4 w-4" />
                                <span>Add Image</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Information Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {/* Tour Name */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="name">Tour Name</label>
                            <input
                                id="name"
                                type="text"
                                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                placeholder="Enter tour name"
                                {...register("name")}
                            />
                            {errors.name && <div className="text-red-600 text-sm font-light">{errors.name.message}</div>}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="country">Country</label>
                            <div className="relative">
                                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="country"
                                    type="text"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Enter country"
                                    {...register("country")}
                                />
                            </div>
                            {errors.country && <div className="text-red-600 text-sm font-light">{errors.country.message}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="city">City</label>
                            <input
                                id="city"
                                type="text"
                                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                placeholder="Enter city"
                                {...register("city")}
                            />
                            {errors.city && <div className="text-red-600 text-sm font-light">{errors.city.message}</div>}
                        </div>

                        {/* Hotel & Rating */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="hotel">Hotel</label>
                            <input
                                id="hotel"
                                type="text"
                                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                placeholder="Enter hotel name"
                                {...register("hotel")}
                            />
                            {errors.hotel && <div className="text-red-600 text-sm font-light">{errors.hotel.message}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="rating">Rating</label>
                            <div className="relative">
                                <Star className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="rating"
                                    type="number"
                                    min="1"
                                    max="5"
                                    step="0.1"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="1-5 stars"
                                    {...register("rating")}
                                />
                            </div>
                            {errors.rating && <div className="text-red-600 text-sm font-light">{errors.rating.message}</div>}
                        </div>

                        {/* Pricing & Capacity */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="price">Price ($)</label>
                            <input
                                id="price"
                                type="number"
                                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                placeholder="Enter price"
                                {...register("price")}
                            />
                            {errors.price && <div className="text-red-600 text-sm font-light">{errors.price.message}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="maxCapacity">Max Capacity</label>
                            <div className="relative">
                                <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="maxCapacity"
                                    type="number"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Maximum guests"
                                    {...register("maxCapacity")}
                                />
                            </div>
                            {errors.maxCapacity && <div className="text-red-600 text-sm font-light">{errors.maxCapacity.message}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="availableSpots">Available Spots</label>
                            <input
                                id="availableSpots"
                                type="number"
                                className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                placeholder="Available spots"
                                {...register("availableSpots")}
                            />
                            {errors.availableSpots && <div className="text-red-600 text-sm font-light">{errors.availableSpots.message}</div>}
                        </div>

                        {/* Dates */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="checkInDate">Check-In Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="checkInDate"
                                    type="date"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    {...register("checkInDate")}
                                />
                            </div>
                            {errors.checkInDate && <div className="text-red-600 text-sm font-light">{errors.checkInDate.message}</div>}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="checkOutDate">Check-Out Date</label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="checkOutDate"
                                    type="date"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    {...register("checkOutDate")}
                                />
                            </div>
                            {errors.checkOutDate && <div className="text-red-600 text-sm font-light">{errors.checkOutDate.message}</div>}
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <label className="text-sm text-green-600 font-light" htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            className="w-full p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                            rows="4"
                            placeholder="Describe your tour..."
                            {...register("description")}
                        />
                        {errors.description && <div className="text-red-600 text-sm font-light">{errors.description.message}</div>}
                    </div>

                    {/* Submit Button */}
                    <div className="pt-6 border-t border-emerald-100">
                        <button
                            type="submit"
                            className="px-8 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium text-sm"
                        >
                            {id ? 'Update Tour' : 'Create Tour'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}