const { config } = require('dotenv');
const chats = require('./chats.schema');

const mongoose = require('mongoose');
config();
exports.connectDB = async () => {
    let status = false;
    const db = `mongodb+srv://${process.env.DATABASE_USER}:${process.env.DATABASE_PW}@${process.env.DATABASE_CLUSTER}.mongodb.net/${process.env.DATABASE_NAME}?retryWrites=true&w=majority`;
    const opts = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    };
    try {
        const connection = await mongoose.connect(db, opts);
        if (connection) {
            status = true;
            console.log('MongoDB connected');
        }
    } catch (error) {
        console.log(error);
    }

    return status;
};
