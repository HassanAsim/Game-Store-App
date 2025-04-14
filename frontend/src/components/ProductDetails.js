import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching product details. Please try again later.');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!product) return <div className="alert alert-warning">Product not found</div>;

  return (
    <div className="row">
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
        <span className="badge bg-primary mb-3">{product.category}</span>
        <p>{product.description}</p>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="text-success mb-0">${product.price}</h3>
          <span className={`badge ${product.stock > 0 ? 'bg-success' : 'bg-danger'}`}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        <button 
          className="btn btn-primary me-2"
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
  );
};

export default ProductDetails;