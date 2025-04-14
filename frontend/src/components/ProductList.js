import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import SearchFilters from './SearchFilters';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pages: 1,
    total: 0
  });

  const location = useLocation();

  const fetchProducts = useCallback(async () => {
    try {
      const params = new URLSearchParams(location.search);
      const response = await axios.get(`http://localhost:5000/api/products?${params.toString()}`);
      const data = response.data;
      setProducts(data.products);
      setPagination({
        page: data.page,
        pages: data.pages,
        total: data.total
      });
      setLoading(false);
    } catch (err) {
      setError('Error fetching products. Please try again later.');
      setLoading(false);
    }
  }, [location.search]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFilterChange = () => {
    setLoading(true);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <SearchFilters onFilterChange={handleFilterChange} />
        </div>
        <div className="col-md-9">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>Products ({pagination.total})</h4>
            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={pagination.page === 1}
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.set('page', pagination.page - 1);
                  window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
                  fetchProducts();
                }}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={pagination.page === pagination.pages}
                onClick={() => {
                  const params = new URLSearchParams(location.search);
                  params.set('page', pagination.page + 1);
                  window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
                  fetchProducts();
                }}
              >
                Next
              </button>
            </div>
          </div>
          
          <div className="row">
            {products.map((product) => (
              <div key={product._id} className="col-md-4 mb-4">
                <div className="card h-100">
                  <img 
                    src={product.imageUrl} 
                    className="card-img-top" 
                    alt={product.title} 
                    style={{height: '200px', objectFit: 'cover'}} 
                  />
                  <div className="card-body">
                    <h5 className="card-title">{product.title}</h5>
                    <p className="card-text text-truncate">{product.description}</p>
                    <div className="mb-2">
                      {renderStars(product.rating)}
                      <small className="text-muted ms-2">
                        ({product.numReviews} reviews)
                      </small>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-primary">{product.category}</span>
                      <span className="text-success fw-bold">${product.price}</span>
                    </div>
                    <Link 
                      to={`/product/${product._id}`} 
                      className="btn btn-primary mt-2 w-100"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {products.length === 0 && (
            <div className="alert alert-info">
              No products found matching your criteria.
            </div>
          )}

          {pagination.pages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(pagination.pages)].map((_, index) => (
                  <li
                    key={index}
                    className={`page-item ${pagination.page === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => {
                        const params = new URLSearchParams(location.search);
                        params.set('page', index + 1);
                        window.history.pushState({}, '', `${location.pathname}?${params.toString()}`);
                        fetchProducts();
                      }}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductList;