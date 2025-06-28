import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux"
import registerSchema from "../../validation/register.schema";
import { yupResolver } from "@hookform/resolvers/yup";
import { registerUser } from "../../store/auth/actions";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { MapPin, User, Lock, Mail, AlertCircle } from "lucide-react";

export default function RegisterForm() {
    const { error, success } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(registerSchema),
        mode: "onChange",
    });

    useEffect(() => {
        if (success) navigate("/login");
    }, [navigate, success]);

    const submitForm = (data) => {
        dispatch(registerUser(data));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100/50 p-6">
            <div className="w-full max-w-md">
                <div className="bg-white/80 backdrop-blur-md shadow-sm border border-green-100/50 rounded-2xl p-8">
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="flex items-center space-x-2 mb-4">
                            <div className="bg-green-600 p-3 rounded-full shadow-sm">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <span className="text-2xl font-light text-green-900 tracking-tight">Wonder</span>
                        </div>
                        <h2 className="text-2xl font-light text-green-900 mb-2">Create Account</h2>
                        <div className="w-16 h-px bg-emerald-300"></div>
                    </div>

                    <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
                        {/* Server Error */}
                        {error && (
                            <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600">
                                <AlertCircle className="h-4 w-4" />
                                <span className="text-sm font-light">{error}</span>
                            </div>
                        )}

                        {/* Username Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="reg-username">
                                Username
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="reg-username"
                                    type="text"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Choose a username"
                                    {...register("username")}
                                />
                            </div>
                            {errors.username && (
                                <div className="text-red-600 text-sm font-light">{errors.username.message}</div>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="email">
                                Email
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="email"
                                    type="email"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                />
                            </div>
                            {errors.email && (
                                <div className="text-red-600 text-sm font-light">{errors.email.message}</div>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="reg-password">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="reg-password"
                                    type="password"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Create a password"
                                    {...register("password")}
                                />
                            </div>
                            {errors.password && (
                                <div className="text-red-600 text-sm font-light">{errors.password.message}</div>
                            )}
                        </div>

                        {/* Confirm Password Field */}
                        <div className="space-y-2">
                            <label className="text-sm text-green-600 font-light" htmlFor="confirmPassword">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-emerald-500" strokeWidth={1.5} />
                                <input
                                    id="confirmPassword"
                                    type="password"
                                    className="w-full pl-10 p-3 border border-green-200 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors font-light text-green-900"
                                    placeholder="Confirm your password"
                                    {...register("confirmPassword")}
                                />
                            </div>
                            {errors.confirmPassword && (
                                <div className="text-red-600 text-sm font-light">{errors.confirmPassword.message}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300 font-light tracking-wide shadow-sm"
                        >
                            Create Account
                        </button>

                        {/* Login Link */}
                        <div className="text-center pt-4 border-t border-green-100">
                            <p className="text-green-600 font-light">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
                                >
                                    Log in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
