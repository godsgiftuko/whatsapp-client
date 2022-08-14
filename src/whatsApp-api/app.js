const whatsappWeb = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
const Qrcode = require('qrcode');
const auth = require('./auth');
const { AuthError } = require('../helpers/error');
const chats = require('./chats');

module.exports = function () {
    return new Promise((resolve, reject) => {
        const isAuthenicated = auth({
            whatsappWeb,
            qrcode: {
                Qrcode,
            },
            showCliProgress: false,
        })
        .then(async (client) => {
            const instance = 'hadSession' in client ? await client.generatedQR : client;
            chats(instance);
            return resolve(true && instance)
        })
        .catch((err) => {
            return reject(err)
            // console.log('Internal error', err);
        });
    })
};
