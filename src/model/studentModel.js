const mongoose = require('mongoose')
const mongoose_delete = require('mongoose-delete')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tên sinh viên là bắt buộc'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Email là bắt buộc'],
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Email không hợp lệ'],
    },
    birthDate: {
        type: Date,
    },
    class: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
    }],
    teacher: { type: String, trim: true },
}, { timestamps: true });

studentSchema.index(
    { email: 1 },
    { unique: true, partialFilterExpression: { deletedAt: null } }
);

studentSchema.plugin(mongoose_delete, {
    overrideMethods: 'all',
    deletedAt: true
});

module.exports = mongoose.model('Student', studentSchema);