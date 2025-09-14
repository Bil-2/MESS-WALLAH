import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Rooms from './pages/Rooms';
import RoomDetails from './pages/RoomDetails';
import Dashboard from './pages/Dashboard';
import Bookings from './pages/Bookings';
import HowItWorks from './pages/HowItWorks';
import ListMess from './pages/ListMess';
import OwnerGuide from './pages/OwnerGuide';
import Pricing from './pages/Pricing';
import Help from './pages/Help';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import About from './pages/About';
import Privacy from './pages/Privacy';
import Safety from './pages/Safety';
import Support from './pages/Support';
import BookingPolicy from './pages/BookingPolicy';
import Report from './pages/Report';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <div className="min-h-screen relative overflow-hidden">
            {/* Animated Background */}
            <div className="fixed inset-0 -z-10">
              {/* Base gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 dark:from-slate-950 dark:via-purple-950 dark:to-slate-950"></div>

              {/* Animated mesh gradient overlay */}
              <div className="absolute inset-0 bg-mesh-gradient opacity-20 animate-pulse-slow"></div>

              {/* Floating orbs */}
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-3xl animate-float"></div>
              <div className="absolute top-3/4 right-1/4 w-80 h-80 bg-neon-cyan/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute top-1/2 left-3/4 w-72 h-72 bg-neon-pink/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>

              {/* Grid pattern overlay */}
              <div className="absolute inset-0 opacity-10">
                <div className="h-full w-full" style={{
                  backgroundImage: `
                    linear-gradient(rgba(99, 102, 241, 0.3) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(99, 102, 241, 0.3) 1px, transparent 1px)
                  `,
                  backgroundSize: '50px 50px'
                }}></div>
              </div>
            </div>

            {/* Main content with glassmorphism */}
            <div className="relative z-10 min-h-screen backdrop-blur-sm">
              <Navbar />
              <main className="relative">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/rooms" element={<Rooms />} />
                  <Route path="/rooms/:id" element={<RoomDetails />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/bookings" element={<Bookings />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/list-mess" element={<ListMess />} />
                  <Route path="/owner-guide" element={<OwnerGuide />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/help" element={<Help />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/safety" element={<Safety />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/booking-policy" element={<BookingPolicy />} />
                  <Route path="/report" element={<Report />} />
                </Routes>
              </main>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
