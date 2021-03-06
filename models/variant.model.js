import mongoose from 'mongoose';

const VariantSchema = mongoose.Schema({
  variantTitle: {type: String},
  variantItems: [
    {
      itemName: {type: String},
      itemThumbnail: {type: String},
      itemPrice: {type: Number},
    }
  ],
  product: {type: mongoose.Schema.Types.ObjectId, ref: 'Product', required:   true
  },
  createdDate: { type: Date, default: Date.now },
})

const Variant = mongoose.model('Variant', VariantSchema);
export default Variant