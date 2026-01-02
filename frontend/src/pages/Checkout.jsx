import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useStudent } from '../context/StudentContext';

const Checkout = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { enroll, user } = useStudent();

    // In a real app, you'd fetch the course details by ID
    // For now, we'll try to use state passed from navigation or a mock lookup
    const course = location.state?.course || { id, title: 'Selected Course', price: 'Rs.4999', image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d' };

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        cardNumber: '',
        expiry: '',
        cvv: ''
    });

    const [errors, setErrors] = useState({});

    React.useEffect(() => {
        if (user) {
            // Check if essential profile details are missing
            const requiredFields = ['phone', 'address', 'city', 'country', 'zipCode'];
            const missingFields = requiredFields.filter(field => !user[field]);

            if (missingFields.length > 0) {
                navigate('/student/profile', {
                    state: { message: 'Please complete your profile details (Address, Phone, etc.) before purchasing a course.' }
                });
            }
        }
    }, [user, navigate]);
    const [isLoading, setIsLoading] = useState(false);

    const validateForm = () => {
        const newErrors = {};
        const cardNumberRegex = /^[0-9]{16}$/;
        const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
        const cvvRegex = /^[0-9]{3,4}$/;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!formData.name.trim()) {
            newErrors.name = 'Full Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Invalid email format';
        }

        if (!formData.cardNumber) {
            newErrors.cardNumber = 'Card Number is required';
        } else if (!cardNumberRegex.test(formData.cardNumber.replace(/\s/g, ''))) {
            newErrors.cardNumber = 'Card Number must be 16 digits';
        }

        if (!formData.expiry) {
            newErrors.expiry = 'Expiry Date is required';
        } else if (!expiryRegex.test(formData.expiry)) {
            newErrors.expiry = 'Invalid format (MM/YY)';
        }

        if (!formData.cvv) {
            newErrors.cvv = 'CVV is required';
        } else if (!cvvRegex.test(formData.cvv)) {
            newErrors.cvv = 'CVV must be 3 or 4 digits';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            // Save payment to database
            const response = await fetch('http://localhost:5000/api/payments', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userName: formData.name,
                    userEmail: formData.email,
                    courseTitle: course.title,
                    price: course.price,
                    cardNumber: formData.cardNumber
                })
            });

            if (response.ok) {
                // Determine course ID to enroll
                const courseIdToEnroll = course.id || (course.title === 'Web Development Bootcamp' ? 1 : 2); // Fallback logic if needed, or better pass full course object

                // Simulate payment processing delay for UX
                setTimeout(async () => {
                    await enroll({ ...course, id: courseIdToEnroll });
                    setIsLoading(false);
                    alert('Payment Successful! Course added to your library.');
                    navigate('/student/dashboard');
                }, 1500);
            } else {
                setIsLoading(false);
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Payment Error:', error);
            setIsLoading(false);
            alert('An error occurred during payment.');
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user types
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: null });
        }
    };

    return (
        <div className="container" style={{ padding: '6rem 2rem' }}>
            <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>

                {/* Payment Form */}
                <div className="glass-panel animate-scale-in" style={{ padding: '2.5rem' }}>
                    <h2 style={{ marginBottom: '2rem' }}>Secure Checkout</h2>
                    <form onSubmit={handleSubmit}>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Personal Details</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                placeholder="Full Name"
                                onChange={handleChange}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${errors.name ? '#ff4d4d' : 'var(--border-color)'}`, color: 'var(--text-main)', outline: 'none' }}
                            />
                            {errors.name && <span style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.name}</span>}
                        </div>
                        <div style={{ marginBottom: '2rem' }}>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                placeholder="Email Address"
                                onChange={handleChange}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${errors.email ? '#ff4d4d' : 'var(--border-color)'}`, color: 'var(--text-main)', outline: 'none' }}
                            />
                            {errors.email && <span style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.email}</span>}
                        </div>

                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>Payment Method</h4>
                        <div style={{ marginBottom: '1rem' }}>
                            <input
                                type="text"
                                name="cardNumber"
                                value={formData.cardNumber}
                                maxLength="16"
                                placeholder="Card Number"
                                onChange={handleChange}
                                style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${errors.cardNumber ? '#ff4d4d' : 'var(--border-color)'}`, color: 'var(--text-main)', outline: 'none' }}
                            />
                            {errors.cardNumber && <span style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.cardNumber}</span>}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                            <div>
                                <input
                                    type="text"
                                    name="expiry"
                                    value={formData.expiry}
                                    maxLength="5"
                                    placeholder="MM/YY"
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${errors.expiry ? '#ff4d4d' : 'var(--border-color)'}`, color: 'var(--text-main)', outline: 'none' }}
                                />
                                {errors.expiry && <span style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.expiry}</span>}
                            </div>
                            <div>
                                <input
                                    type="text"
                                    name="cvv"
                                    value={formData.cvv}
                                    maxLength="4"
                                    placeholder="CVV"
                                    onChange={handleChange}
                                    style={{ width: '100%', padding: '1rem', borderRadius: '8px', background: 'var(--bg-card)', border: `1px solid ${errors.cvv ? '#ff4d4d' : 'var(--border-color)'}`, color: 'var(--text-main)', outline: 'none' }}
                                />
                                {errors.cvv && <span style={{ color: '#ff4d4d', fontSize: '0.85rem', marginTop: '0.25rem', display: 'block' }}>{errors.cvv}</span>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            style={{ width: '100%', justifyContent: 'center', opacity: isLoading ? 0.7 : 1 }}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Processing...' : `Pay ${course.price}`}
                        </button>
                    </form>
                </div>

                {/* Order Summary */}
                <div>
                    <div className="glass-panel animate-fade-in" style={{ padding: '2rem', position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Order Summary</h3>
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                            <img src={course.image} alt="Course" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                            <div>
                                <h4 style={{ fontSize: '1rem', lineHeight: '1.4' }}>{course.title}</h4>
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Lifetime Access</span>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                            <span>Total</span>
                            <span>{course.price}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Checkout;
