const mongoose = require('mongoose');

const schema = mongoose.Schema;

// const sub = new Schema({subcategory: String});
const subcats = new schema({name: String,
    subCategories: [this],
    items: [String]});


const CategorySchema = new schema({
    category : {
        type: String,
        required: true,
        trim: true,
        unique:true,
        minlength: 3
    },

    subCategories: [subcats],

});

const Category = mongoose.model('Category', CategorySchema);

module.exports = Category;