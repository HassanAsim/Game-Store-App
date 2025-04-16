import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

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

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setIsSubmitting(true);
        setError('');
        
        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/');
        } catch (err) {
            setError('Registration failed. This email might already be registered.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const togglePasswordVisibility = (field) => {
        if (field === 'password') {
            setShowPassword(!showPassword);
        } else {
            setShowConfirmPassword(!showConfirmPassword);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow auth-form">
                        <div className="card-body">
                            <h2>Register</h2>
                            {error && <div className="alert alert-danger">{error}</div>}
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control form-control-lg"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Enter your name"
                                        disabled={isSubmitting}
                                        autoComplete="name"
                                    />
                                </div>
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
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            className="form-control form-control-lg"
                                            value={formData.password}
                                            onChange={handleChange}
                                            required
                                            placeholder="Create a password"
                                            disabled={isSubmitting}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => togglePasswordVisibility('password')}
                                            tabIndex="-1"
                                        >
                                            <i className={`fas fa-${showPassword ? 'eye-slash' : 'eye'}`}></i>
                                        </button>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Confirm Password</label>
                                    <div className="input-group">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            name="confirmPassword"
                                            className="form-control form-control-lg"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            required
                                            placeholder="Confirm your password"
                                            disabled={isSubmitting}
                                            autoComplete="new-password"
                                        />
                                        <button
                                            type="button"
                                            className="btn btn-outline-secondary"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            tabIndex="-1"
                                        >
                                            <i className={`fas fa-${showConfirmPassword ? 'eye-slash' : 'eye'}`}></i>
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
                                            Registering...
                                        </>
                                    ) : 'Register'}
                                </button>
                                <div className="form-footer">
                                    Already have an account?{' '}
                                    <Link to="/login" className="form-link">Return to Login</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;