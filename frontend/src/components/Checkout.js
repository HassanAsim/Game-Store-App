import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Checkout = () => {
    const { user, loading, logout } = useAuth();
    const { cartItems, getCartTotal } = useCart();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
        paymentMethod: 'Credit Card'
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');

    // List of countries for the dropdown
    const countries = [
        'United States', 'Canada', 'United Kingdom', 'Australia', 
        'Germany', 'France', 'Japan', 'South Korea', 'China', 
        'Brazil', 'Mexico', 'Spain', 'Italy', 'Pakistan', 
        'Sweden', 'Norway', 'Denmark', 'Finland', 'Singapore'
    ].sort();

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
            return;
        }

        if (!cartItems || cartItems.length === 0) {
            navigate('/cart');
            return;
        }
    }, [user, loading, cartItems, navigate]);

    const validateField = (name, value) => {
        switch (name) {
            case 'address':
                return value.trim().length < 5 ? 'Address must be at least 5 characters long' : '';
            case 'city':
                return value.trim().length < 2 ? 'Please enter a valid city name' : '';
            case 'postalCode':
                return !/^[A-Z0-9]{4,10}$/i.test(value.trim()) 
                    ? 'Please enter a valid postal code (4-10 characters)' : '';
            case 'country':
                return !value ? 'Please select a country' : '';
            default:
                return '';
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
        if (submitError) setSubmitError('');
    };

    const validateForm = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            if (key !== 'paymentMethod') {
                const error = validateField(key, formData[key]);
                if (error) newErrors[key] = error;
            }
        });
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        setSubmitError('');
        
        try {
            // Validate auth first
            const validateResponse = await fetch('http://localhost:5000/api/auth/validate', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });

            if (!validateResponse.ok) {
                logout();
                navigate('/login');
                throw new Error('Session expired. Please login again.');
            }

            // Proceed with order creation
            const orderItems = cartItems.map(item => ({
                product: item._id,
                title: item.title,
                quantity: Number(item.quantity),
                imageUrl: item.imageUrl,
                price: Number(item.price)
            }));

            const orderData = {
                orderItems,
                shippingAddress: {
                    address: formData.address.trim(),
                    city: formData.city.trim(),
                    postalCode: formData.postalCode.trim(),
                    country: formData.country.trim()
                },
                paymentMethod: formData.paymentMethod,
                itemsPrice: Number(getCartTotal()),
                shippingPrice: 0,
                totalPrice: Number(getCartTotal())
            };

            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(orderData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create order');
            }
            
            navigate(`/order/${data._id}?showPayment=true`);
        } catch (err) {
            setSubmitError(err.message || 'Error creating order. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <div className="text-center">Loading...</div>;
    }

    if (!user) {
        return null; // Let useEffect handle redirect
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-8">
                    <div className="card shadow auth-form">
                        <div className="card-body">
                            <h3 className="mb-4">Shipping Information</h3>
                            {submitError && <div className="alert alert-danger">{submitError}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Street Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className={`form-control form-control-lg ${errors.address ? 'is-invalid' : ''}`}
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your street address"
                                        disabled={isSubmitting}
                                        autoComplete="street-address"
                                    />
                                    {errors.address && (
                                        <div className="invalid-feedback">{errors.address}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className={`form-control form-control-lg ${errors.city ? 'is-invalid' : ''}`}
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your city"
                                        disabled={isSubmitting}
                                        autoComplete="address-level2"
                                    />
                                    {errors.city && (
                                        <div className="invalid-feedback">{errors.city}</div>
                                    )}
                                </div>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        className={`form-control form-control-lg ${errors.postalCode ? 'is-invalid' : ''}`}
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your postal code"
                                        disabled={isSubmitting}
                                        autoComplete="postal-code"
                                    />
                                    {errors.postalCode && (
                                        <div className="invalid-feedback">{errors.postalCode}</div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Country</label>
                                    <select
                                        name="country"
                                        className={`form-select form-select-lg ${errors.country ? 'is-invalid' : ''}`}
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                        autoComplete="country"
                                    >
                                        <option value="">Select a country</option>
                                        {countries.map(country => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.country && (
                                        <div className="invalid-feedback">{errors.country}</div>
                                    )}
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        className="form-select form-select-lg"
                                        value={formData.paymentMethod}
                                        onChange={handleChange}
                                        disabled={isSubmitting}
                                    >
                                        <option value="Credit Card">Credit Card</option>
                                        <option value="PayPal">PayPal</option>
                                    </select>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Creating Order...
                                        </>
                                    ) : 'Place Order'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h4 className="card-title">Order Summary</h4>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Items:</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Shipping:</span>
                                <span>Free</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong>${getCartTotal().toFixed(2)}</strong>
                            </div>
                            {cartItems.map(item => (
                                <div key={item._id} className="mb-2 small">
                                    <span>{item.quantity} x {item.title}</span>
                                    <span className="float-end">
                                        ${(item.price * item.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;