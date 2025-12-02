const mongoose = require('mongoose');
const { Schema } = mongoose;

const ProductsSchema = new Schema(
    {
        productImage: { type: [String], default: [] },
        productTitle: { type: String, required: true },
        productDescription: { type: String },
        productQuantity: { type: Number, default: 0 },
        productPrice: { type: Number, required: true },
        categoriesName: { type: String, required: true },
        archived: { type: Boolean, default: false }
    },
    {
        timestamps: true,
        collection: 'products',
    }
);

const ProductsModel = mongoose.model('Products', ProductsSchema);

module.exports = ProductsModel;
