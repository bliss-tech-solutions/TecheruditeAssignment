import React, { useState } from 'react';
import { Modal, Tabs } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import './ProductDetailModal.css';

const ProductDetailModal = ({ product, visible, onClose }) => {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    if (!product) return null;

    const images = product.productImage && product.productImage.length > 0 
        ? product.productImage 
        : ['https://via.placeholder.com/500x500/f3f4f6/9ca3af?text=No+Image'];

    const categories = Array.isArray(product.categoriesName) 
        ? product.categoriesName 
        : [product.categoriesName].filter(Boolean);

    const tabItems = [
        {
            key: 'details',
            label: 'Details',
            children: (
                <div className="tab-content">
                    <div className="details-grid">
                        <div className="detail-row">
                            <span className="detail-label">Category</span>
                            <span className="detail-value">{categories.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Stock Available</span>
                            <span className="detail-value">{product.productQuantity || 0} units</span>
                        </div>
                        <div className="detail-row">
                            <span className="detail-label">Product ID</span>
                            <span className="detail-value">{product._id || 'N/A'}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            key: 'description',
            label: 'Description',
            children: (
                <div className="tab-content">
                    <p className="product-description-text">
                        {product.productDescription || 'No description available for this product.'}
                    </p>
                </div>
            ),
        },
    ];

    return (
        <Modal
            open={visible}
            onCancel={onClose}
            footer={null}
            width={1000}
            centered
            closeIcon={<CloseOutlined />}
            className="product-detail-modal"
            destroyOnClose
        >
            <div className="modal-content">
                {/* Left Side - Images */}
                <div className="modal-images-section">
                    <div className="main-image-container">
                        <img 
                            src={images[selectedImageIndex]} 
                            alt={product.productTitle}
                            className="modal-main-image"
                        />
                    </div>
                    
                    {images.length > 1 && (
                        <div className="thumbnail-gallery">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    className={`thumbnail-btn ${selectedImageIndex === index ? 'active' : ''}`}
                                    onClick={() => setSelectedImageIndex(index)}
                                >
                                    <img src={img} alt={`View ${index + 1}`} />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Right Side - Product Info */}
                <div className="modal-info-section">
                    <div className="product-header">
                        <div className="category-tags">
                            {categories.map((cat, index) => (
                                <span key={index} className="category-tag">{cat}</span>
                            ))}
                        </div>
                        <h1 className="product-title">{product.productTitle}</h1>
                    </div>

                    <div className="price-section">
                        <span className="current-price">
                            ${typeof product.productPrice === 'number' 
                                ? product.productPrice.toFixed(2) 
                                : product.productPrice || '0.00'}
                        </span>
                        <div className="stock-info">
                            <span className={`stock-badge ${product.productQuantity > 0 ? 'in-stock' : 'out-of-stock'}`}>
                                {product.productQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                            </span>
                            <span className="stock-count">{product.productQuantity || 0} available</span>
                        </div>
                    </div>

                    <div className="tabs-section">
                        <Tabs 
                            defaultActiveKey="details" 
                            items={tabItems}
                            className="product-tabs"
                        />
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ProductDetailModal;
