const { connectMysql } = require('../database/mysql/mysql');
const { InternalError } = require('../helpers/error');
const {encode, decode} = require("./buffer")

exports.Storage = function() {
    const toBool = (val) => {
        return !!JSON.parse(String(val).toLowerCase());
    }
    const encrypt = toBool(process.env.ENCRYPT_DATA);

    return {
        update: (query) => {
            return new Promise(async (resolve, reject) => {
                const dataBase = await connectMysql;               
        
                dataBase.query(query, (err, res) => {
                    if (err) {
                        // throw err;
                        console.log('Unable to save data', err);
                        reject(false);
                    }

                    resolve(res);
                    // console.log('Last insert ID:', res.insertId);
                });
            });
        },
        set: ({ metaData, table }) => {
            return new Promise(async (resolve, reject) => {
                const dataBase = await connectMysql;               
                if (encrypt && 'user' in metaData) {
                    metaData.messages = encode(metaData.messages);
                    metaData.user = encode(metaData.user); 
                }
        
                dataBase.query(`INSERT INTO ${table} SET ?`, metaData, (err, res) => {
                    if (err) {
                        // throw err;
                        console.log('Unable to save data', err);
                        reject(false);
                    }

                    resolve(true && res);
                    // console.log('Last insert ID:', res.insertId);
                });
            });
        },
        /**
         * 
         * @param table - Specify table - string
         * @param col - Specify column - string
         * @param order - Specify column - bool
         * @param delimiter - A reference column to how data should be selected from table - string
         * @param sort - option - DESC, ASC. Order in which column should be queried - string 
         * @returns 
         */
        get: ({ table, col, order = true, delimiter, sort = 'DESC' }) => {
            return new Promise(async (resolve, reject) => {
                console.log('getting from DB');
                const dataBase = await connectMysql;    
                console.log({dataBase});
                const orderList = `ORDER BY ${delimiter} ${sort}`;

                const query = col && delimiter && order
                    ? `SELECT ${col} FROM ${table} ${(order ? orderList : '')}` 
                    : `SELECT * FROM ${table} ${(order ? orderList : '')}`;

                dataBase.query(query, function (error, results, fields) {
                        if (error) {    
                            reject('Internal Error');
                            throw new InternalError(error);
                        }
                        
                        if (encrypt) {
                            results.map((result) => {
                                if ('user' in result) {
                                    result.messages = decode(result.messages);
                                    result.user = decode(result.user);
                                    // console.log(result.messages);
                                }
        
                                return result;
                            });
                        }
    
    
                        return resolve(results);
                    }
                );
            });
        },
        delete: ({ table, col, id }) => {
            return new Promise(async (resolve, reject) => {
                const dataBase = await connectMysql;               
                dataBase.query(
                    // `DELETE FROM chats WHERE msgId = '${id}'`,
                    `DELETE FROM ${table} WHERE ${col} = '${id}'`,
                    function (error, results, fields) {
                        if (error) {
                            console.log("Unable to delete")
                            return reject(false);
                            // throw new InternalError(error);
                        }
    
                        return resolve(true);
                    }
                );
            });
        },
    };
}