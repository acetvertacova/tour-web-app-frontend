import { useForm } from "react-hook-form";

export default function TourSearch({ onSearch }) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        const params = {};
        // makes pair key - value ex: country: Italy and then checks if value is not empty adds it in params
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined && value !== '' && value !== null) {
                params[key] = value;
            }
        });
        onSearch(params);
    };

    const handleReset = () => {
        reset();
        onSearch({});
    };

    return (
        <div className="bg-white border border-green-100 rounded-lg p-8 mb-12">
            <div className="text-center mb-8">
                <h3 className="text-2xl font-light text-green-900 mb-2">Find Your Perfect Tour</h3>
                <div className="w-16 h-px bg-emerald-300 mx-auto"></div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Location and Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Country</label>
                        <input
                            placeholder="e.g. Italy, France"
                            {...register('country')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 placeholder-green-400 transition-colors duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Price From</label>
                        <input
                            type="text"
                            {...register('priceFrom')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 placeholder-green-400 transition-colors duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Price To</label>
                        <input
                            type="text"
                            {...register('priceTo')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 placeholder-green-400 transition-colors duration-200"
                        />
                    </div>
                </div>

                {/* Rating and Availability */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Stars</label>
                        <select
                            {...register('rating')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 bg-white transition-colors duration-200"
                        >
                            <option value="5">5 stars</option>
                            <option value="4">4 stars</option>
                            <option value="3">3 stars</option>
                            <option value="2">2 stars</option>
                            <option value="1">1 stars</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Available Spots</label>
                        <input
                            type="number"
                            {...register('availableSpots')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 placeholder-green-400 transition-colors duration-200"
                        />
                    </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Start Date From</label>
                        <input
                            type="date"
                            {...register('dateFrom')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 transition-colors duration-200"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-light text-green-600">Start Date To</label>
                        <input
                            type="date"
                            {...register('dateTo')}
                            className="w-full px-4 py-3 border border-green-200 rounded-lg focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-200 text-green-900 transition-colors duration-200"
                        />
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg hover:bg-emerald-700 transition-colors duration-200 font-medium"
                    >
                        Search Tours
                    </button>
                    <button
                        type="button"
                        onClick={handleReset}
                        className="flex-1 sm:flex-initial bg-white text-emerald-600 py-3 px-6 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition-colors duration-200 font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </form>
        </div>
    );
}