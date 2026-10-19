const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const classSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên lớp là bắt buộc'],
        trim: true,
    },
    year: {
        type: Number,
        min: [2000, 'Năm không hợp lệ'],
    },
    teacher: { type: String, trim: true },
}, { timestamps: true });

classSchema.plugin(mongoose_delete, {
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = mongoose.model('Class', classSchema);