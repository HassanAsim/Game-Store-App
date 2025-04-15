import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const SearchFilters = ({ onFilterChange }) => {
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [filters, setFilters] = useState({
        keyword: '',
        category: '',
        brand: '',
        minPrice: '',
        maxPrice: ''
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        fetchCategories();
        fetchBrands();
        // Parse URL params for initial filters
        const params = new URLSearchParams(location.search);
        setFilters({
            keyword: params.get('keyword') || '',
            category: params.get('category') || '',
            brand: params.get('brand') || '',
            minPrice: params.get('minPrice') || '',
            maxPrice: params.get('maxPrice') || ''
        });
    }, [location.search]);

    const fetchCategories = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/categories');
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const fetchBrands = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/products/brands');
            const data = await response.json();
            setBrands(data);
        } catch (error) {
            console.error('Error fetching brands:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const queryParams = new URLSearchParams();
        
        Object.entries(filters).forEach(([key, value]) => {
            if (value) queryParams.append(key, value);
        });

        navigate(`${location.pathname}?${queryParams.toString()}`);
        onFilterChange(filters);
    };

    const handleReset = () => {
        setFilters({
            keyword: '',
            category: '',
            brand: '',
            minPrice: '',
            maxPrice: ''
        });
        onFilterChange({});
        const queryParams = new URLSearchParams();
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    return (
        <div className="card mb-4 search-filters-card">
            <div className="card-body">
                <h5 className="card-title">Search & Filters</h5>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Search products..."
                            name="keyword"
                            value={filters.keyword}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-select"
                            name="category"
                            value={filters.category}
                            onChange={handleInputChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map(category => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-3">
                        <select
                            className="form-select"
                            name="brand"
                            value={filters.brand}
                            onChange={handleInputChange}
                        >
                            <option value="">All Brands</option>
                            {brands.map(brand => (
                                <option key={brand} value={brand}>
                                    {brand}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="row mb-3">
                        <div className="col">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Min Price"
                                name="minPrice"
                                value={filters.minPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="col">
                            <input
                                type="number"
                                className="form-control"
                                placeholder="Max Price"
                                name="maxPrice"
                                value={filters.maxPrice}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="d-flex gap-2 filter-buttons">
                        <button type="submit" className="btn btn-primary flex-grow-1">
                            Apply Filters
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default SearchFilters;