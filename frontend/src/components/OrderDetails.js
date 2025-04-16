import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const OrderDetails = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [hasScrolled, setHasScrolled] = useState(false);
    const { id } = useParams();
    const { user } = useAuth();
    const { clearCart } = useCart();
    const location = useLocation();
    const showPaymentScreen = new URLSearchParams(location.search).get('showPayment') === 'true';

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/orders/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch order');
                }

                const data = await response.json();
                setOrder(data);
                setLoading(false);

                // Clear cart after successfully fetching the order details
                if (showPaymentScreen) {
                    clearCart();
                }

                // Only scroll once when component mounts and if conditions are met
                if (showPaymentScreen && !data.isPaid && !hasScrolled) {
                    const paymentSection = document.getElementById('payment-section');
                    if (paymentSection) {
                        paymentSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        setHasScrolled(true);
                    }
                }
            } catch (err) {
                setError('Error fetching order details');
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user.token, showPaymentScreen, clearCart, hasScrolled]);

    const handlePayment = async () => {
        setPaymentLoading(true);
        try {
            // Simulating payment processing
            const paymentResult = {
                id: Date.now().toString(),
                status: 'completed',
                update_time: new Date().toISOString(),
                email_address: user.email
            };

            const response = await fetch(`http://localhost:5000/api/orders/${id}/pay`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(paymentResult)
            });

            if (!response.ok) {
                throw new Error('Payment failed');
            }

            const updatedOrder = await response.json();
            setOrder(updatedOrder);
            alert('Payment successful!');
        } catch (err) {
            setError('Payment failed. Please try again.');
        } finally {
            setPaymentLoading(false);
        }
    };

    if (loading) return <div className="text-center">Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    if (!order) return <div className="alert alert-warning">Order not found</div>;

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Order Details</h2>
            <div className="row">
                <div className="col-md-8">
                    <div className="order-details-section">
                        <div className="card border-0">
                            <div className="card-body">
                                <h5 className="card-title">Shipping Information</h5>
                                <p className="mb-1">Address: {order.shippingAddress.address}</p>
                                <p className="mb-1">City: {order.shippingAddress.city}</p>
                                <p className="mb-1">Postal Code: {order.shippingAddress.postalCode}</p>
                                <p className="mb-1">Country: {order.shippingAddress.country}</p>
                                <p className="mt-3 mb-1">
                                    Status: {order.isDelivered ? (
                                        <span className="text-success">Delivered on {new Date(order.deliveredAt).toLocaleDateString()}</span>
                                    ) : (
                                        <span className="text-warning">Not Delivered</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div id="payment-section" className="card border-0">
                            <div className="card-body">
                                <h5 className="card-title">Payment Method</h5>
                                <p className="mb-1">{order.paymentMethod}</p>
                                <p className="mb-0">
                                    Status: {order.isPaid ? (
                                        <span className="text-success">Paid on {new Date(order.paidAt).toLocaleDateString()}</span>
                                    ) : (
                                        <span className="text-danger">Not Paid</span>
                                    )}
                                </p>
                            </div>
                        </div>

                        <div className="card border-0">
                            <div className="card-body">
                                <h5 className="card-title">Order Items</h5>
                                {order.orderItems.map((item) => (
                                    <div key={item._id} className="d-flex align-items-center mb-3">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            className="me-3"
                                        />
                                        <div className="flex-grow-1">
                                            <Link to={`/product/${item.product}`}>{item.title}</Link>
                                            <p className="mb-0">
                                                {item.quantity} x ${item.price} = ${(item.quantity * item.price).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Items:</span>
                                <span>${order.itemsPrice.toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                                <span>Shipping:</span>
                                <span>${order.shippingPrice.toFixed(2)}</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong>${order.totalPrice.toFixed(2)}</strong>
                            </div>
                            {!order.isPaid && (
                                <button 
                                    className="btn btn-primary w-100"
                                    onClick={handlePayment}
                                    disabled={paymentLoading}
                                >
                                    {paymentLoading ? 'Processing...' : 'Pay Now'}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;