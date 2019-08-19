const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    prod_name: { type: String},
    prod_desc: { type: String },
    prod_price: { type: Number },
    prod_image: { type: String }
});

module.exports = mongoose.model('Product', productSchema);