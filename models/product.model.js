import mongoose from 'mongoose';

const ProductSchema = mongoose.Schema({
	product_name: { type: String, required: true },
  product_description: {type: String, required: true},
	product_image: [{ type: String, required: true }], // array to store multiple images
	store: { type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: true },
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Category',
		required: true,
	},
	availability: { type: Boolean, required: true, default: true },
  variant: {
    availability: {type: Boolean, default: false},
    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'Variant'}]
  },
  customFee: {
    availability: {type: Boolean, default: false},  // active||deleted,
    items: [{type: mongoose.Schema.Types.ObjectId, ref: 'CustomFee'}]
  },

  label: {type: mongoose.Schema.Types.ObjectId},
  status: {type: String, default: "active"}, // deleted||active
	price: { type: Number, required: true },
	rating: { type: String, required: false },
	createdDate: { type: Date, default: Date.now },
});

const Product = mongoose.model('Product', ProductSchema);

export default Product;
