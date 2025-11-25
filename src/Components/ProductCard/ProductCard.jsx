import React from 'react';
import './ProductCard.css';

const ProductCard = ({
    product,
    onEdit,
    onDelete,
    onClick
}) => {
    const placeholder = 'https://via.placeholder.com/300x300/f3f4f6/9ca3af?text=No+Image';

    const primaryImage = product.productImage && product.productImage.length > 0
        ? product.productImage[0]
        : placeholder;

    const secondaryImage = product.productImage && product.productImage.length > 1
        ? product.productImage[1]
        : primaryImage;

    const hasHoverImage = primaryImage !== secondaryImage;

    const handleCardClick = (e) => {
        if (e.target.closest('.product-card-actions')) {
            return;
        }
        if (onClick) {
            onClick(product);
        }
    };

    return (
        <div className="product-card" onClick={handleCardClick}>
            <div className={`product-card-image-wrapper ${hasHoverImage ? 'has-hover-image' : ''}`}>
                <img
                    src={primaryImage}
                    alt={product.productTitle}
                    className="product-card-image primary-image"
                />
                {hasHoverImage && (
                    <img
                        src={secondaryImage}
                        alt={`${product.productTitle} - alternate view`}
                        className="product-card-image hover-image"
                    />
                )}
                {onEdit && onDelete && (
                    <div className="product-card-actions">
                        <button
                            className="product-action-btn edit-btn"
                            onClick={() => onEdit(product)}
                            title="Edit Product"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                            </svg>
                        </button>
                        <button
                            className="product-action-btn delete-btn"
                            onClick={() => onDelete(product)}
                            title="Delete Product"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18"></path>
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                            </svg>
                        </button>
                    </div>
                )}
            </div>
            <div className="product-card-info">
                <h3 className="product-card-title">{product.productTitle}</h3>
                <p className="product-card-price">${product.productPrice || product.price || '0.00'}</p>
                <div className="product-card-stock">
                    <span className="stock-label">Stock: {product.productQuantity || 0}</span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
