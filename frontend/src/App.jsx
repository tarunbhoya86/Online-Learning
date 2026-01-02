import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Mentors from './pages/Mentors';
import About from './pages/About';
import SignIn from './pages/SignIn';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import HelpCenter from './pages/HelpCenter';
import ChatSupport from './pages/ChatSupport';
import SubmitTicket from './pages/SubmitTicket';
import Careers from './pages/Careers';
import JobApplication from './pages/JobApplication';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import MainLayout from './layouts/MainLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminCourses from './pages/admin/AdminCourses';
import AdminSettings from './pages/admin/AdminSettings';

import { StudentProvider } from './context/StudentContext';
import Checkout from './pages/Checkout';
import StudentDashboard from './pages/student/StudentDashboard';
import CoursePlayer from './pages/student/CoursePlayer';
import Profile from './pages/student/Profile';
import Certificate from './pages/student/Certificate';

import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';

import ScrollToTop from './components/ScrollToTop';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      <ScrollToTop />
      <StudentProvider>
        <DataProvider>

          <ThemeProvider>
            <Toaster position="top-center" reverseOrder={false} />
            <Routes>
              {/* Public Routes with Main Navbar */}
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetail />} />
                <Route path="/courses/:id/checkout" element={<Checkout />} />
                <Route path="/mentors" element={<Mentors />} />
                <Route path="/about" element={<About />} />
                <Route path="/help" element={<HelpCenter />} />
                <Route path="/support/chat" element={<ChatSupport />} />
                <Route path="/support/ticket" element={<SubmitTicket />} />
                <Route path="/careers" element={<Careers />} />
                <Route path="/careers/apply/:jobId" element={<JobApplication />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/signin" element={<SignIn />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/profile" element={<Profile />} />
                <Route path="/course/:id/learn" element={<CoursePlayer />} />
              </Route>

              {/* Standalone Route for Certificate (No Layout/Navbar) */}
              <Route path="/student/course/:id/certificate" element={<Certificate />} />

              {/* Admin Routes (No Main Navbar) */}
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<AdminUsers />} />
                <Route path="mentors" element={<AdminUsers onlyMentors={true} />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="settings" element={<AdminSettings />} />
              </Route>
            </Routes>
          </ThemeProvider>
        </DataProvider>
      </StudentProvider>
    </Router>
  );
}

export default App;
