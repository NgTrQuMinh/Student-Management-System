const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const option = {
            dbName: process.env.DB_NAME,
            user: process.env.USER,
            pass: process.env.PASS
        }
        await mongoose.connect(process.env.URL, option);
    } catch (error) {
        console.error('Error connect to Db', error);
    }
}

module.exports = connectDB;