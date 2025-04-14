import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products');
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching products. Please try again later.');
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="row">
      {products.map((product) => (
        <div key={product._id} className="col-md-4 mb-4">
          <div className="card h-100">
            <img src={product.imageUrl} className="card-img-top" alt={product.title} style={{height: '200px', objectFit: 'cover'}} />
            <div className="card-body">
              <h5 className="card-title">{product.title}</h5>
              <p className="card-text text-truncate">{product.description}</p>
              <div className="d-flex justify-content-between align-items-center">
                <span className="badge bg-primary">{product.category}</span>
                <span className="text-success fw-bold">${product.price}</span>
              </div>
              <Link to={`/product/${product._id}`} className="btn btn-primary mt-2 w-100">
                View Details
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductList;