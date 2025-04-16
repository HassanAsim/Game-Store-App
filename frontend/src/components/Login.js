import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error when user starts typing
        if (error) setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        
        setIsSubmitting(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Invalid email or password');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow auth-form">
                        <div className="card-body">
                            <h2>Login</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control form-control-lg"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your email"
                                        disabled={isSubmitting}
                                        autoComplete="email"
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control form-control-lg"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Enter your password"
                                            disabled={isSubmitting}
                                            autoComplete="current-password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={togglePasswordVisibility}
                                            tabIndex="-1"
                                        >
                                            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    type="submit" 
                                    className="btn btn-primary btn-lg w-100 mb-3"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Logging in...
                                        </>
                                    ) : 'Login'}
                                </button>
                                <div className="form-footer">
                                    Don't have an account?{' '}
                                    <Link to="/register" className="form-link">Register here</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;