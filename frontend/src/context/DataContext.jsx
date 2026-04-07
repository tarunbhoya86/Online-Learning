import React, { createContext, useState, useEffect, useContext } from 'react';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const [courses, setCourses] = useState([]);
    const [users, setUsers] = useState([]);
    const [activities, setActivities] = useState([
        { id: 1, action: 'System Init', details: 'System started successfully', time: new Date().toLocaleTimeString() }
    ]);

    const logActivity = (action, details) => {
        setActivities(prev => [{ id: Date.now(), action, details, time: new Date().toLocaleTimeString() }, ...prev]);
    };

    // Fetch Data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const coursesRes = await fetch('http://localhost:5000/api/courses');
                const coursesData = await coursesRes.json();
                setCourses(coursesData.map(c => ({ ...c, id: c._id })));

                // For users, ideally only admin should see this, but for now fetching all for demo
                const usersRes = await fetch('http://localhost:5000/api/auth/users'); // Need to implement this route or similar
                const usersData = await usersRes.json();
                setUsers(usersData.map(u => ({ ...u, id: u._id })));
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Course Actions
    const addCourse = async (course) => {
        try {
            const res = await fetch('http://localhost:5000/api/courses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(course)
            });
            const newCourse = await res.json();
            setCourses([...courses, { ...newCourse, id: newCourse._id }]);
            logActivity('Add Course', `Course ${newCourse.title} added`);
        } catch (error) {
            console.error('Error adding course:', error);
        }
    };

    const updateCourse = async (id, updatedCourse) => {
        try {
            const res = await fetch(`http://localhost:5000/api/courses/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedCourse)
            });
            const data = await res.json();
            setCourses(courses.map(course => course._id === id ? { ...course, ...data, id: data._id } : course));
            logActivity('Update Course', `Course ${data.title} updated`);
            return { success: true };
        } catch (error) {
            console.error('Error updating course:', error);
            return { success: false, message: 'Failed to update course' };
        }
    };

    const deleteCourse = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/courses/${id}`, { method: 'DELETE' });
            setCourses(courses.filter(course => course._id !== id));
            logActivity('Delete Course', `Course ${id} deleted`);
        } catch (error) {
            console.error('Error deleting course:', error);
        }
    };

    // User Actions
    const addUser = async (user) => {
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user)
            });
            const newUser = await res.json();
            if (res.ok) {
                setUsers([...users, { ...newUser.user, id: newUser.user._id }]);
                logActivity('Add User', `User ${newUser.user.name} added`);
                return { success: true };
            } else {
                return { success: false, message: newUser.message || 'Failed to add user' };
            }
        } catch (error) {
            console.error('Error adding user:', error);
            return { success: false, message: 'Network or Server Error' };
        }
    };

    const updateUser = async (id, updatedUser) => {
        try {
            const res = await fetch(`http://localhost:5000/api/auth/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedUser)
            });
            const data = await res.json();
            if (res.ok) {
                setUsers(users.map(user => user._id === id ? { ...user, ...data.user, id: data.user._id } : user));
                logActivity('Update User', `User ${data.user.name} updated`);
                return { success: true };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, message: 'Failed to update user' };
        }
    };

    const deleteUser = async (id) => {
        try {
            await fetch(`http://localhost:5000/api/auth/users/${id}`, { method: 'DELETE' });
            setUsers(users.filter(user => user._id !== id));
            logActivity('Delete User', `User ${id} deleted`);
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <DataContext.Provider value={{
            courses,
            users,
            addCourse,
            updateCourse,
            deleteCourse,
            addUser,
            updateUser,
            deleteUser,
            activities,
            logActivity
        }}>
            {children}
        </DataContext.Provider>
    );
};
