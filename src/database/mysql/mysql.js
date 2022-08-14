const mysql = require('mysql');

const MYSQL = () => {
    const DATABASE_CONFIG = {
        connectionLimit: 1000,
        connectTimeout: 60 * 60 * 1000,
        acquireTimeout: 60 * 60 * 1000,
        timeout: 60 * 60 * 1000,
        host: process.env.DATABASE_HOST || 'localhost',
        user: process.env.DATABASE_USER || 'root',
        password: process.env.DATABASE_PW || '',
        database: process.env.DATABASE_NAME || 'whatsapp_bot',
        charset: process.env.DATABASE_CHARSET,
    };

    const currentProtocol = process.env.DATABASE_CONNECTION_TYPE || 'createConnection';
    
    let method = 'getConnection';
    let connectDB = mysql[currentProtocol](DATABASE_CONFIG);
    if (currentProtocol == 'createConnection') {
        delete DATABASE_CONFIG.connectTimeout;
        delete DATABASE_CONFIG.connectionLimit;
        delete DATABASE_CONFIG.timeout;
        delete DATABASE_CONFIG.acquireTimeout;
        method = 'connect';
    }

    // console.log(currentProtocol, method);

    const driver = new Promise((resolve, reject) => {
        connectDB[method](function (err, connection) {
            try {
                if (err) {
                    console.error('error connecting: ' + err.stack);
                    return reject(false);
                }
    
                console.log(
                    `DataBase connected! \n DB_NAME => ${DATABASE_CONFIG.database} \n DB_CON_TYPE => ${currentProtocol.includes('Connection') ? 'DEFAULT' : 'POOL'} `
                );
                return resolve(connectDB);
            } catch (error) {
                console.log(error,
                `An error while establising connection with ${DATABASE_CONFIG.user}@${DATABASE_CONFIG.host}. Database not connected!`
                );
            }
        });
    })
    
    return {
        driver
    }
}

exports.connectMysql = MYSQL().driver

