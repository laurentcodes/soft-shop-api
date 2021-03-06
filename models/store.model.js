import mongoose from 'mongoose';

const StoreSchema = mongoose.Schema({
	name: { type: String, required: true },
	images: [{ type: String, required: true }], // array to store multiple images
	address: { type: String, required: true },
	phone_number: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	password: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
	openingTime: { type: String, required: true },
	closingTime: { type: String, required: true },
	deliveryTime: { type: String },
	location: {
		longitude: { type: String },
		latitude: { type: String },
	},
  labels: [{
    labelTitle: {type: String},
    labelThumb: {type: String} //Label thumbnail
  }],
  isVerified: {type: Boolean, default: false}, // this validates a store on the platform
  isActive: {type: Boolean, default: true},  // this shows if a store is available to receive orders
	createdDate: { type: Date, default: Date.now },
  tax: { type: String },
});

const Store = mongoose.model('Store', StoreSchema);

export default Store;
