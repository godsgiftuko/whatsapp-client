const { connectMysql } = require('../database/mysql/mysql');
exports.storage = {
    set: ({ metaData }) => {
        return new Promise(async (resolve, reject) => {
            const dataBase = await connectMysql();

            dataBase.query('INSERT INTO chats SET ?', metaData, (err, res) => {
                if (err) throw err;

                console.log('Last insert ID:', res.insertId);
            });
        });
    },
    get: () => {
        return new Promise(async (resolve, reject) => {
            const dataBase = await connectMysql();

            dataBase.query(
                'SELECT * from chats',
                function (error, results, fields) {
                    if (error) {
                        console.log(error);
                        throw reject(false);
                    }

                    console.log(results);
                    return resolve(true);
                }
            );
        });
    },
};
