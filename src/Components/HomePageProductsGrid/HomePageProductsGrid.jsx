import React, { useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Drawer, Button, message, Popconfirm, Spin, Input } from "antd";
import { PlusOutlined, SearchOutlined, CheckOutlined } from "@ant-design/icons";
import {
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../store/slices/productsSlice";
import ProductCard from "../ProductCard/ProductCard";
import ProductForm from "./ProductForm";
import ProductDetailModal from "../ProductDetailModal/ProductDetailModal";
import "./HomePageProductsGrid.css";

const HomePageProductsGrid = () => {
    const dispatch = useDispatch();
    const { items: products, loading } = useSelector((state) => state.products);

    const [drawerVisible, setDrawerVisible] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    // Fetch products on mount
    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    // Get unique categories from products
    const categories = useMemo(() => {
        const allCategories = products.flatMap(product => {
            // Handle both string and array categoriesName
            if (Array.isArray(product.categoriesName)) {
                return product.categoriesName;
            }
            return product.categoriesName ? [product.categoriesName] : [];
        });
        return [...new Set(allCategories.filter(Boolean))];
    }, [products]);

    // Toggle category selection
    const toggleCategory = (category) => {
        setSelectedCategories(prev => {
            if (prev.includes(category)) {
                return prev.filter(c => c !== category);
            } else {
                return [...prev, category];
            }
        });
    };

    // Clear all filters
    const clearFilters = () => {
        setSelectedCategories([]);
        setSearchQuery("");
    };

    // Filter products based on search and categories
    const filteredProducts = useMemo(() => {
        return products.filter(product => {
            // Search filter
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                const titleMatch = product.productTitle?.toLowerCase().includes(query);
                const descMatch = product.productDescription?.toLowerCase().includes(query);
                if (!titleMatch && !descMatch) return false;
            }

            // Category filter (if any categories selected)
            if (selectedCategories.length > 0) {
                const productCategories = Array.isArray(product.categoriesName) 
                    ? product.categoriesName 
                    : [product.categoriesName];
                
                // Check if product has any of the selected categories
                const hasMatchingCategory = selectedCategories.some(cat => 
                    productCategories.includes(cat)
                );
                if (!hasMatchingCategory) return false;
            }

            return true;
        });
    }, [products, searchQuery, selectedCategories]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategories]);

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setDrawerVisible(true);
    };

    const handleDeleteProduct = async (product) => {
        try {
            await dispatch(deleteProduct(product._id)).unwrap();
            message.success('Product deleted successfully');
        } catch (error) {
            const errorMessage = typeof error === 'string' 
                ? error 
                : error?.message || 'Failed to delete product. Please try again.';
            message.error(errorMessage);
        }
    };

    const handleProductClick = (product) => {
        setSelectedProduct(product);
        setDetailModalVisible(true);
    };

    const handleFormSubmit = async (values) => {
        try {
            if (editingProduct) {
                await dispatch(updateProduct({ 
                    productId: editingProduct._id, 
                    productData: values 
                })).unwrap();
                message.success('Product updated successfully');
            } else {
                await dispatch(createProduct(values)).unwrap();
                message.success('Product created successfully');
            }
            setDrawerVisible(false);
            setEditingProduct(null);
        } catch (error) {
            // Handle both string errors and Error objects
            const errorMessage = typeof error === 'string' 
                ? error 
                : error?.message || 'Something went wrong. Please try again.';
            message.error(errorMessage);
        }
    };

    return (
        <div className="products-page">
            {/* Header Section */}
            <div className="products-header">
                <h1 className="products-title">Products</h1>
                <div className="products-header-actions">
                    <div className="search-wrapper">
                        <SearchOutlined className="search-icon" />
                        <Input
                            placeholder="Search product..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="search-input"
                            bordered={false}
                        />
                    </div>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                            setEditingProduct(null);
                            setDrawerVisible(true);
                        }}
                        className="add-product-btn"
                    >
                        Add New Product
                    </Button>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="categories-filter">
                <button
                    className={`category-btn ${selectedCategories.length === 0 ? 'active' : ''}`}
                    onClick={clearFilters}
                >
                    {selectedCategories.length === 0 && (
                        <CheckOutlined className="category-check" />
                    )}
                    All
                </button>
                {categories.map((category) => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                        onClick={() => toggleCategory(category)}
                    >
                        {selectedCategories.includes(category) && (
                            <CheckOutlined className="category-check" />
                        )}
                        {category}
                    </button>
                ))}
            </div>

            {/* Products Count */}
            {!loading && filteredProducts.length > 0 && (
                <div className="products-count">
                    Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
                </div>
            )}

            {/* Products Grid */}
            {loading ? (
                <div className="loading-container">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    {currentProducts.length > 0 ? (
                        <div className="products-grid">
                            {currentProducts.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                    onEdit={handleEditProduct}
                                    onDelete={handleDeleteProduct}
                                    onClick={handleProductClick}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                fill="none" 
                                viewBox="0 0 24 24" 
                                strokeWidth="1.5" 
                                stroke="currentColor" 
                                className="empty-icon"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" 
                                />
                            </svg>
                            <h3 className="empty-title">No products found</h3>
                            <p className="empty-description">
                                {searchQuery 
                                    ? `No products match "${searchQuery}"` 
                                    : 'Start by adding your first product'}
                            </p>
                            {!searchQuery && (
                                <Button
                                    type="primary"
                                    icon={<PlusOutlined />}
                                    onClick={() => {
                                        setEditingProduct(null);
                                        setDrawerVisible(true);
                                    }}
                                    className="empty-add-btn"
                                >
                                    Add Product
                                </Button>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* Pagination */}
            {!loading && filteredProducts.length > productsPerPage && (
                <div className="pagination-container">
                    <button 
                        className="pagination-btn pagination-prev"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                        </svg>
                        Previous
                    </button>
                    
                    <div className="pagination-numbers">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                            // Show first page, last page, current page, and pages around current
                            const showPage = page === 1 || 
                                           page === totalPages || 
                                           Math.abs(page - currentPage) <= 1;
                            
                            // Show ellipsis
                            if (!showPage) {
                                if (page === 2 && currentPage > 3) {
                                    return <span key={page} className="pagination-ellipsis">...</span>;
                                }
                                if (page === totalPages - 1 && currentPage < totalPages - 2) {
                                    return <span key={page} className="pagination-ellipsis">...</span>;
                                }
                                return null;
                            }
                            
                            return (
                                <button
                                    key={page}
                                    className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </button>
                            );
                        })}
                    </div>
                    
                    <button 
                        className="pagination-btn pagination-next"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" width="16" height="16">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>
            )}

            {/* Product Form Drawer */}
            <Drawer
                title={editingProduct ? "Edit Product" : "Add New Product"}
                placement="right"
                onClose={() => {
                    setDrawerVisible(false);
                    setEditingProduct(null);
                }}
                open={drawerVisible}
                width={window.innerWidth > 768 ? 1000 : '100%'}
                destroyOnClose
            >
                <ProductForm
                    initialValues={editingProduct}
                    onSubmit={handleFormSubmit}
                    onCancel={() => {
                        setDrawerVisible(false);
                        setEditingProduct(null);
                    }}
                    loading={loading}
                />
            </Drawer>

            {/* Product Detail Modal */}
            <ProductDetailModal
                product={selectedProduct}
                visible={detailModalVisible}
                onClose={() => {
                    setDetailModalVisible(false);
                    setSelectedProduct(null);
                }}
            />
        </div>
    );
};

export default HomePageProductsGrid;