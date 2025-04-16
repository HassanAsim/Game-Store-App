import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, loading } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
            return;
        }

        const fetchOrders = async () => {
            if (!user) return; // Don't fetch if no user

            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user.token}`
                    }
                };

                const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                setOrders(data);
                setLoadingOrders(false);
                setError(null);
            } catch (err) {
                const message = err.response?.data?.message || 'Error fetching your orders. Please try again later.';
                setError(message);
                setLoadingOrders(false);
            }
        };

        fetchOrders();
    }, [user, loading, navigate]);

    // Show loading while checking auth state
    if (loading || loadingOrders) {
        return <div className="text-center">Loading...</div>;
    }

    // Don't render anything if user is null - let useEffect handle redirect
    if (!user) {
        return null;
    }

    return (
        <div className="container mt-4">
            <div className="row">
                <div className="col-md-4">
                    <div className="card mb-4">
                        <div className="card-body">
                            <h4 className="card-title">Profile Information</h4>
                            <div className="mb-3">
                                <strong>Name:</strong> {user.name}
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong> {user.email}
                            </div>
                            <div className="mb-3">
                                <strong>Account Type:</strong> {user.isAdmin ? 'Administrator' : 'Customer'}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-md-8">
                    <h4>Order History</h4>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {orders.length === 0 ? (
                        <div className="alert alert-info">
                            You haven't placed any orders yet.{' '}
                            <Link to="/">Continue shopping</Link>
                        </div>
                    ) : (
                        <div className="table-responsive">
                            <table className="table table-hover">
                                <thead>
                                    <tr>
                                        <th>Order ID</th>
                                        <th>Date</th>
                                        <th>Total</th>
                                        <th>Paid</th>
                                        <th>Delivered</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map((order) => (
                                        <tr key={order._id}>
                                            <td>{order._id}</td>
                                            <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td>${order.totalPrice.toFixed(2)}</td>
                                            <td>
                                                {order.isPaid ? (
                                                    <span className="badge bg-success">
                                                        Paid on {new Date(order.paidAt).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-danger">Not Paid</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.isDelivered ? (
                                                    <span className="badge bg-success">
                                                        Delivered on {new Date(order.deliveredAt).toLocaleDateString()}
                                                    </span>
                                                ) : (
                                                    <span className="badge bg-warning">Not Delivered</span>
                                                )}
                                            </td>
                                            <td>
                                                <Link 
                                                    to={`/order/${order._id}`}
                                                    className="btn btn-primary btn-sm"
                                                >
                                                    Details
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;