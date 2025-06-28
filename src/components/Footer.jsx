import { MapPin, Mail, Phone, Globe } from "lucide-react";
import { NavLink } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-r from-emerald-800 to-emerald-900 text-white border-t border-emerald-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Company Info */}
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <div className="bg-emerald-600 p-2 rounded-full">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-emerald-100">Wonder</span>
                        </div>
                        <p className="text-emerald-200 text-sm leading-relaxed">
                            Discover amazing destinations and create unforgettable memories with our curated travel experiences.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-emerald-100">Quick Links</h3>
                        <ul className="space-y-2">
                            <li>
                                <NavLink to="/" className="text-emerald-200 hover:text-white transition duration-200">
                                    Tours
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to="/about" className="text-emerald-200 hover:text-white transition duration-200">
                                    About Us
                                </NavLink>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-emerald-100">Contact Us</h3>
                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 text-emerald-300" />
                                <span className="text-emerald-200 text-sm">acetvert@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 text-emerald-300" />
                                <span className="text-emerald-200 text-sm">+ (373) 60211195</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Globe className="h-4 w-4 text-emerald-300" />
                                <span className="text-emerald-200 text-sm">www.wonder.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="border-t border-emerald-700 mt-8 pt-6">
                    <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0">
                        <p className="text-emerald-200 text-sm">
                            &copy; {new Date().getFullYear()} Wonder. All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}