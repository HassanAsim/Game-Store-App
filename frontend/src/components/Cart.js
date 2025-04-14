import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
    const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = () => {
        if (!user) {
            navigate('/login');
            return;
        }
        navigate('/checkout');
    };

    const handleUpdateQuantity = (itemId, newQuantity, maxStock) => {
        if (!itemId) return;
        if (newQuantity > 0 && newQuantity <= maxStock) {
            updateQuantity(itemId, newQuantity);
        }
    };

    const handleRemoveItem = (itemId) => {
        if (!itemId) return;
        removeFromCart(itemId);
    };

    if (!cartItems || cartItems.length === 0) {
        return (
            <div className="text-center mt-5">
                <h2>Your cart is empty</h2>
                <Link to="/" className="btn btn-primary mt-3">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mt-4">
            <h2 className="mb-4">Shopping Cart</h2>
            <div className="row">
                <div className="col-md-8">
                    {cartItems.map((item) => (
                        item && item._id ? (
                            <div key={item._id} className="card mb-3">
                                <div className="row g-0">
                                    <div className="col-md-4">
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="img-fluid rounded-start"
                                            style={{ height: '200px', objectFit: 'cover' }}
                                        />
                                    </div>
                                    <div className="col-md-8">
                                        <div className="card-body">
                                            <h5 className="card-title">{item.title}</h5>
                                            <p className="card-text text-success fw-bold">
                                                ${item.price}
                                            </p>
                                            <div className="d-flex align-items-center mb-3">
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity - 1, item.stock)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <span className="mx-2">{item.quantity}</span>
                                                <button
                                                    className="btn btn-outline-secondary btn-sm"
                                                    onClick={() => handleUpdateQuantity(item._id, item.quantity + 1, item.stock)}
                                                    disabled={item.quantity >= item.stock}
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveItem(item._id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    ))}
                </div>
                <div className="col-md-4">
                    <div className="card">
                        <div className="card-body">
                            <h5 className="card-title">Order Summary</h5>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Subtotal:</span>
                                <span>${getCartTotal().toFixed(2)}</span>
                            </div>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping:</span>
                                <span>FREE</span>
                            </div>
                            <hr />
                            <div className="d-flex justify-content-between mb-3">
                                <strong>Total:</strong>
                                <strong>${getCartTotal().toFixed(2)}</strong>
                            </div>
                            <button
                                className="btn btn-primary w-100"
                                onClick={handleCheckout}
                            >
                                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;