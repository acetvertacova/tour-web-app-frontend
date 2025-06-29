import { Route, Routes } from 'react-router-dom';
import './App.css'
import Tours from './components/tours/Tours'
import MainLayout from './layout/MainLayout';
import NotFound from './pages/NotFound';
import { ToastContainer } from 'react-toastify';
import TourDetails from './components/tours/TourDetails';
import RegisterForm from './components/forms/auth/RegisterForm';
import LoginForm from './components/forms/auth/LoginForm';
import Booking from './components/tours/Booking';
import BookingPage from './pages/BookingPage';
import TourForm from "./components/forms/TourForm";
import AboutUsPage from './pages/AboutUsPage';

function App() {

  return (
    <>
      <Routes>
        <Route element={<MainLayout />} >
          <Route index element={<Tours />} />
          <Route path='/tours/:id' element={<TourDetails />} />
          <Route path='form'>
            <Route path='create' element={<TourForm />} />
            <Route path=':id/edit' element={<TourForm />} />
          </Route>
          <Route path='/register' element={<RegisterForm />} />
          <Route path='/login' element={<LoginForm />} />
          <Route path="/booking/:id" element={<Booking />} />
          <Route path="/bookings" element={<BookingPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App
