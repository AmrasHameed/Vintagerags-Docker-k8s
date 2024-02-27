const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    types: {
        type: Array,
        default: ['All']
    },
    status: {
        type: Boolean,
        required: true,
        default: true
    }
});

const CatModel = mongoose.model('categories', catSchema);

module.exports = CatModel;
