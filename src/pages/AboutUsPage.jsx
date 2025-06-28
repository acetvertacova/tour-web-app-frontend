export default function AboutUs() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
            <p className="text-lg mb-4">
                Welcome to <span className="font-semibold">Wonder</span> — your trusted travel companion.
                We are passionate about helping you discover the world with unforgettable tours and exceptional service.
            </p>
            <p className="text-lg mb-4">
                Our mission is to make traveling easy, affordable, and exciting. Whether you're looking for
                adventurous getaways, cultural experiences, or relaxing retreats, we've got a tour for you.
            </p>
            <p className="text-lg mb-4">
                Our team works hard to select the best destinations and ensure smooth bookings, expert guides,
                and complete satisfaction.
            </p>
            <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-2">Why Choose Us?</h2>
                <ul className="list-disc list-inside text-lg space-y-2">
                    <li>Easy booking system</li>
                    <li>Wide range of tours for all tastes</li>
                    <li>Real customer reviews</li>
                </ul>
            </div>
            <p className="text-lg mt-8">
                Thank you for choosing <span className="font-semibold">Wonder</span>. Let's explore the world together!
            </p>
        </div>
    );
}
