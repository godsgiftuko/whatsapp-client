const WHATSAPP_INIT = require('../whatsApp-api/app');
const utils = require('../utils/utils');

const exists = () => utils.fileExists('./session.json');
const isAuth = exists();
// if (!exists) {
//     console.log(false);
// } else {
//     console.log(true);
// }

const landing = async (req, res) => {
    WHATSAPP_INIT();

    !(await isAuth)
        ? res.render('home', {
              title: 'Home',
          })
        : res.redirect('/messages');
};

const messages = async (req, res) => {
    console.log(await isAuth, 'pages');
    (await isAuth)
        ? res.render('messages', {
              title: 'messages',
          })
        : res.redirect('/');
};

const qrCode = async function (req, res) {
    const QRCode = require('qrcode');
    const utils = require('../utils/utils');
    const fs = require('fs');

    const { dirname } = require('path');
    const appDir = dirname(require.main.filename);

    // console.log(appDir);

    try {
        if (req.xhr) {
            const src = './public/images/generatedQR.png';
            const exists = await utils.fileExists(src);

            if (!exists) {
                WHATSAPP_INIT();
            } else {
                res.json({ url: src.split('./public')[1] });
            }
        }
    } catch (err) {
        res.json(err);
    }
};

module.exports = {
    landing,
    qrCode,
    messages,
};
