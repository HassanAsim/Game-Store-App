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
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setError('');
        
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
            
            // Navigate to order details with a query parameter to show payment screen
            navigate(`/order/${data._id}?showPayment=true`);
        } catch (err) {
            setError(err.message || 'Error creating order. Please try again.');
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
                    <div className="card">
                        <div className="card-body">
                            <h3 className="card-title mb-4">Shipping Information</h3>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label">Address</label>
                                    <input
                                        type="text"
                                        name="address"
                                        className="form-control"
                                        value={formData.address}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">City</label>
                                    <input
                                        type="text"
                                        name="city"
                                        className="form-control"
                                        value={formData.city}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Postal Code</label>
                                    <input
                                        type="text"
                                        name="postalCode"
                                        className="form-control"
                                        value={formData.postalCode}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Country</label>
                                    <input
                                        type="text"
                                        name="country"
                                        className="form-control"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        disabled={isSubmitting}
                                    />
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Payment Method</label>
                                    <select
                                        name="paymentMethod"
                                        className="form-control"
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
                                    className="btn btn-primary"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? 'Creating Order...' : 'Place Order'}
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