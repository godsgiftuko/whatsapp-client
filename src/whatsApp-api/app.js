const whatsappWeb = require('whatsapp-web.js');
// const qrcode = require('qrcode-terminal');
const Qrcode = require('qrcode');
const auth = require('./auth');
const { AuthError } = require('../helpers/error');
const chats = require('./chats');
// const chat = require('./src/chats');

var config = {
    errorCorrectionLevel: 'H',
    type: 'image/jpeg',
    quality: 0.3,
    margin: 1,
    color: {
        dark: '#010599FF',
        light: '#FFBF60FF',
    },
};

module.exports = function () {
    const isAuthenicated = auth({
        whatsappWeb,
        qrcode: {
            config,
            Qrcode,
        },
        showCliProgress: false,
    })
        .then((instance) => {
            // console.log(instance);
            console.log('Client started == isAuthenicated');
            chats(instance);
        })
        .catch((err) => {
            // throw new AuthError(err);
            // console.log(err);
            console.log('Internal error', err);
        });
};
