const mysql = require('mysql');
const { config } = require('dotenv');

config();

exports.connectMysql = () => {
    const connectDB = mysql.createPool({
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PW || '',
        database: process.env.DATABASE_NAME || 'whatsapp_bot',
    });

    return new Promise((resolve, reject) => {
        connectDB.getConnection(function (err, connection) {
            if (err) {
                console.error('error connecting: ' + err.stack);
                return reject(false);
            }

            console.log('Db connected');
            return resolve(connection);
        });
    });
};
