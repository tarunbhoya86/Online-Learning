import React, { createContext, useState, useContext } from 'react';
import toast from 'react-hot-toast';

const StudentContext = createContext();

export const useStudent = () => useContext(StudentContext);

export const StudentProvider = ({ children }) => {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [user, setUser] = useState(JSON.parse(sessionStorage.getItem('user')) || null);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        setEnrolledCourses([]);
        sessionStorage.removeItem('user');
        toast.success('Signed out successfully');
    };

    // Fetch enrolled courses when user changes
    React.useEffect(() => {
        if (user && user.id) {
            fetchEnrolledCourses(user.id);
        }
    }, [user]);

    const fetchEnrolledCourses = async (userId) => {
        try {
            const res = await fetch(`http://localhost:5000/api/auth/${userId}/courses`);
            if (res.ok) {
                const courses = await res.json();
                // Map _id to id if necessary, though populate might return objects.
                // Assuming backend Populate returns course objects.
                setEnrolledCourses(courses.map(c => ({ ...c, id: c._id })));
            }
        } catch (error) {
            console.error("Failed to fetch courses", error);
        }
    };

    const enroll = async (course) => {
        if (!user) return alert("Please login to enroll");

        try {
            const res = await fetch('http://localhost:5000/api/auth/enroll', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user._id, courseId: course.id || course._id })
            });

            if (res.ok) {
                setEnrolledCourses((prev) => {
                    if (prev.find(c => c.id === course.id)) return prev;
                    return [...prev, { ...course, enrolledDate: new Date().toLocaleDateString() }];
                });
            }
        } catch (error) {
            console.error("Enrollment failed", error);
        }
    };

    const cancelCourse = async (courseId) => {
        if (!user) return;
        try {
            const res = await fetch('http://localhost:5000/api/auth/cancel-course', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: user.id || user._id, courseId })
            });

            if (res.ok) {
                setEnrolledCourses((prev) => prev.filter(c => c.id !== courseId && c._id !== courseId));
                return true;
            }
            return false;
        } catch (error) {
            console.error("Cancellation failed", error);
            return false;
        }
    };

    const markChapterCompleted = async (courseId, chapterId, allChapterIds) => {
        if (!user) return;

        // Find current course and its progress
        const courseIndex = enrolledCourses.findIndex(c => c.id === courseId || c._id === courseId);
        if (courseIndex === -1) return;

        const currentEnrollment = enrolledCourses[courseIndex];
        let completed = currentEnrollment.completedChapters || [];

        // Avoid duplicates
        if (completed.includes(chapterId)) return;

        const newCompleted = [...completed, chapterId];
        const progress = Math.round((newCompleted.length / allChapterIds.length) * 100);

        try {
            const res = await fetch('http://localhost:5000/api/auth/update-progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id || user._id,
                    courseId,
                    progress,
                    completedChapters: newCompleted
                })
            });

            if (res.ok) {
                setEnrolledCourses(prev => {
                    const updated = [...prev];
                    updated[courseIndex] = {
                        ...updated[courseIndex],
                        progress,
                        completedChapters: newCompleted
                    };
                    return updated;
                });
            }
        } catch (error) {
            console.error("Progress update failed", error);
        }
    };

    return (
        <StudentContext.Provider value={{ enrolledCourses, enroll, cancelCourse, markChapterCompleted, user, login, logout }}>
            {children}
        </StudentContext.Provider>
    );
};
