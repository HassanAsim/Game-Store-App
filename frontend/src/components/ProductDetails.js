import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import ReviewForm from './ReviewForm';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const fetchProduct = useCallback(async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/products/${id}`);
      setProduct(response.data);
      setLoading(false);
    } catch (err) {
      setError('Error fetching product details. Please try again later.');
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= product.stock) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product || !product._id) {
      setError('Unable to add product to cart');
      return;
    }
    addToCart({
      _id: product._id,
      title: product.title,
      price: product.price,
      imageUrl: product.imageUrl,
      stock: product.stock,
      quantity: quantity
    }, quantity);
    navigate('/cart');
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <i
        key={index}
        className={`fas fa-star ${index < rating ? 'text-warning' : 'text-muted'}`}
      ></i>
    ));
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-warning">Product not found</div>;

  return (
    <div className="container">
      <div className="row mb-4">
        <div className="col-md-6">
          <img 
            src={product.imageUrl} 
            alt={product.title} 
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h2>{product.title}</h2>
          <p className="text-muted">Brand: {product.brand}</p>
          <div className="mb-3">
            {renderStars(product.rating)}
            <span className="ms-2">({product.numReviews} reviews)</span>
          </div>
          <span className="badge bg-primary mb-3">{product.category}</span>
          <p>{product.description}</p>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="text-success mb-0">${product.price}</h3>
            <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
              {product.stock > 0 ? `${product.stock} in Stock` : 'Out of Stock'}
            </span>
          </div>
          {product.stock > 0 && (
            <div className="mb-3">
              <label className="form-label">Quantity:</label>
              <input
                type="number"
                className="form-control"
                min="1"
                max={product.stock}
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>
          )}
          <button 
            className="btn btn-primary me-2"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            Add to Cart
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6">
          <h3 className="mb-4">Reviews</h3>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review) => (
              <div key={review._id} className="card mb-3">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-subtitle mb-2 text-muted">{review.name}</h6>
                    <small className="text-muted">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                  <div className="mb-2">
                    {renderStars(review.rating)}
                  </div>
                  <p className="card-text">{review.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="alert alert-info">No reviews yet</div>
          )}
        </div>
        <div className="col-md-6">
          <ReviewForm 
            productId={id} 
            onReviewSubmitted={fetchProduct}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;