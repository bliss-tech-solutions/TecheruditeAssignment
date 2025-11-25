import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Upload, Button, message, Row, Col, Space, Divider } from 'antd';
import { 
    PlusOutlined, 
    DeleteOutlined, 
    UploadOutlined,
    CloseOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { uploadToCloudinary } from '../../utils/cloudinary';
import './ProductForm.css';

const { TextArea } = Input;
const { Option } = Select;

const DEFAULT_CATEGORIES = [
    'Furniture', 
    'Electronics', 
    'Clothing', 
    'Shoes', 
    'Sports',
    'Grocery',
    'Accessories'
];

const STORAGE_KEY = 'product_categories';

const loadCategories = () => {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            const merged = [...new Set([...DEFAULT_CATEGORIES, ...parsed])];
            return merged;
        }
    } catch (error) {
        console.error('Error loading categories:', error);
    }
    return DEFAULT_CATEGORIES;
};

const saveCategories = (categories) => {
    try {
        const customCategories = categories.filter(cat => !DEFAULT_CATEGORIES.includes(cat));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(customCategories));
    } catch (error) {
        console.error('Error saving categories:', error);
    }
};

const ProductForm = ({ initialValues, onSubmit, onCancel, loading }) => {
    const [form] = Form.useForm();
    const [uploading, setUploading] = useState(false);
    const [imageList, setImageList] = useState([]);
    const [categories, setCategories] = useState(loadCategories);
    const [newCategory, setNewCategory] = useState('');

    useEffect(() => {
        if (initialValues) {
            let categoriesValue = initialValues.categoriesName;
            if (typeof categoriesValue === 'string') {
                categoriesValue = categoriesValue ? [categoriesValue] : [];
            } else if (!Array.isArray(categoriesValue)) {
                categoriesValue = [];
            }
            
            form.setFieldsValue({
                ...initialValues,
                productPrice: initialValues.productPrice || initialValues.price || 0,
                categoriesName: categoriesValue
            });
            if (initialValues.productImage && initialValues.productImage.length > 0) {
                const images = initialValues.productImage.map((url, index) => ({
                    uid: `-${index}`,
                    name: `image-${index}.jpg`,
                    status: 'done',
                    url: url,
                }));
                setImageList(images);
            }
        } else {
            form.resetFields();
            setImageList([]);
        }
    }, [initialValues, form]);

    const handleImageUpload = async (file) => {
        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            message.error(`${file.name} exceeds 5MB limit. Please choose a smaller image.`);
            return false;
        }

        const isImage = file.type.startsWith('image/');
        if (!isImage) {
            message.error(`${file.name} is not a valid image file.`);
            return false;
        }

        if (imageList.length >= 5) {
            message.error('Maximum 5 images allowed. Please remove some images first.');
            return false;
        }

        try {
            setUploading(true);
            const result = await uploadToCloudinary(file);
            const newImage = {
                uid: file.uid || `upload-${Date.now()}`,
                name: file.name,
                status: 'done',
                url: result.secure_url,
            };
            setImageList(prev => [...prev, newImage]);
            message.success('Image uploaded successfully');
        } catch (error) {
            message.error(`Failed to upload: ${error.message}`);
        } finally {
            setUploading(false);
        }

        return false;
    };

    const handleRemoveImage = (uid) => {
        const newList = imageList.filter(item => item.uid !== uid);
        setImageList(newList);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            
            if (imageList.length === 0) {
                message.warning('Please upload at least one product image');
                return;
            }
            
            const productData = {
                ...values,
                productImage: imageList.map(img => img.url).filter(Boolean),
            };
            onSubmit(productData);
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className="product-form-modern">
            <Form
                form={form}
                layout="vertical"
                className="form-modern"
                requiredMark={false}
            >
                <div className="form-section">
                    <h3 className="section-title">Product Information</h3>
                    
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="productTitle"
                                label="Product Title"
                                rules={[
                                    { required: true, message: 'Product title is required' },
                                    { min: 3, message: 'Must be at least 3 characters' },
                                    { max: 100, message: 'Cannot exceed 100 characters' }
                                ]}
                            >
                                <Input 
                                    placeholder="Enter product title"
                                    size="large"
                                    className="modern-input"
                                />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="categoriesName"
                                label="Categories"
                                rules={[
                                    { required: true, message: 'Please select at least one category' },
                                    { type: 'array', min: 1, message: 'Please select at least one category' }
                                ]}
                            >
                                <Select 
                                    mode="multiple"
                                    placeholder="Select categories"
                                    size="large"
                                    className="modern-select modern-select-multiple"
                                    maxTagCount="responsive"
                                    dropdownRender={(menu) => (
                                        <>
                                            {menu}
                                            <Divider style={{ margin: '8px 0' }} />
                                            <div className="add-category-dropdown">
                                                <Input
                                                    placeholder="Add new category"
                                                    value={newCategory}
                                                    onChange={(e) => setNewCategory(e.target.value)}
                                                    onKeyDown={(e) => e.stopPropagation()}
                                                    className="add-category-input"
                                                />
                                                <Button
                                                    type="primary"
                                                    icon={<PlusOutlined />}
                                                    onClick={() => {
                                                        if (newCategory.trim() && !categories.includes(newCategory.trim())) {
                                                            const cat = newCategory.trim();
                                                            const updatedCategories = [...categories, cat];
                                                            setCategories(updatedCategories);
                                                            saveCategories(updatedCategories);
                                                            const currentSelection = form.getFieldValue('categoriesName') || [];
                                                            form.setFieldsValue({ categoriesName: [...currentSelection, cat] });
                                                            setNewCategory('');
                                                            message.success(`Category "${cat}" added`);
                                                        } else if (categories.includes(newCategory.trim())) {
                                                            message.warning('Category already exists');
                                                        }
                                                    }}
                                                    disabled={!newCategory.trim()}
                                                    className="add-category-btn"
                                                >
                                                    Add
                                                </Button>
                                            </div>
                                        </>
                                    )}
                                >
                                    {categories.map(cat => (
                                        <Option key={cat} value={cat}>{cat}</Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item
                        name="productDescription"
                        label="Product Description"
                        rules={[
                            { required: true, message: 'Product description is required' },
                            { min: 10, message: 'Must be at least 10 characters' },
                            { max: 500, message: 'Cannot exceed 500 characters' }
                        ]}
                    >
                        <TextArea
                            rows={4}
                            placeholder="Describe your product..."
                            className="modern-textarea"
                            showCount
                            maxLength={500}
                        />
                    </Form.Item>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Pricing & Inventory</h3>
                    
                    <Row gutter={16}>
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="productPrice"
                                label="Price"
                                rules={[
                                    { required: true, message: 'Price is required' },
                                    { type: 'number', min: 0, message: 'Price must be positive' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="0.00"
                                    style={{ width: '100%' }}
                                    size="large"
                                    min={0}
                                    step={0.01}
                                    precision={2}
                                    className="modern-input-number"
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    parser={value => value.replace(/\$\s?|(,*)/g, '')}
                                />
                            </Form.Item>
                        </Col>
                        
                        <Col xs={24} md={12}>
                            <Form.Item
                                name="productQuantity"
                                label="Stock Quantity"
                                rules={[
                                    { required: true, message: 'Quantity is required' },
                                    { type: 'number', min: 0, message: 'Quantity must be positive' }
                                ]}
                            >
                                <InputNumber
                                    placeholder="0"
                                    style={{ width: '100%' }}
                                    size="large"
                                    min={0}
                                    max={999999}
                                    className="modern-input-number"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </div>

                <div className="form-section">
                    <h3 className="section-title">Product Images</h3>
                    <p className="section-description">Upload up to 5 images (Max 5MB per image)</p>
                    
                    <div className="image-upload-modern">
                        {imageList.length < 5 && (
                            <Upload
                                beforeUpload={handleImageUpload}
                                accept="image/*"
                                showUploadList={false}
                                multiple
                                disabled={uploading}
                            >
                                <div className="upload-trigger">
                                    {uploading ? (
                                        <div className="uploading-state">
                                            <div className="spinner"></div>
                                            <span>Uploading...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <UploadOutlined className="upload-icon" />
                                            <span>Click to upload</span>
                                            <span className="upload-hint">or drag and drop</span>
                                        </>
                                    )}
                                </div>
                            </Upload>
                        )}
                        
                        {imageList.length > 0 && (
                            <div className="uploaded-images">
                                {imageList.map((image) => (
                                    <div key={image.uid} className="uploaded-image-item">
                                        <img src={image.url} alt={image.name} />
                                        <button
                                            className="remove-image-btn"
                                            onClick={() => handleRemoveImage(image.uid)}
                                            type="button"
                                        >
                                            <DeleteOutlined />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    {imageList.length >= 5 && (
                        <p className="image-limit-message">Maximum of 5 images reached</p>
                    )}
                </div>
            </Form>

            <div className="form-actions-modern">
                <Button 
                    size="large"
                    onClick={onCancel} 
                    disabled={loading || uploading}
                    className="cancel-btn-modern"
                >
                    Cancel
                </Button>
                <Button
                    type="primary"
                    size="large"
                    onClick={handleSubmit}
                    loading={loading || uploading}
                    className="submit-btn-modern"
                >
                    {initialValues ? 'Update Product' : 'Add Product'}
                </Button>
            </div>
        </div>
    );
};

export default ProductForm;
