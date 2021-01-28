const mongoose = require('mongoose');
const StoreSchema = mongoose.Schema;

const Storeschema = new StoreSchema({
    name: { type: String, unique:true, required: true },
    images: [{ type: String, required: true }], // array to store multiple images
    address: { type: String, required: true },
    phone_number: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    createdDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Store', Storeschema);