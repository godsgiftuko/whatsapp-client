const hound = require('hound');
const { dirname, join } = require('path');
const fs = require('fs');
const appDir = dirname(require.main.filename);
const utils = require('./src/utils/utils');
const { io, app } = require('./app');

const qrPath = appDir + '/public/images';
const qrCode = qrPath + '/generatedQR.png';
const QR = hound.watch(qrPath);

(async () => {
    const exists = await utils.fileExists('./session.json');
    const findQrcode = await utils.fileExists(qrCode);
    console.log(exists);
    if (!exists && findQrcode) {
        try {
            fs.unlinkSync(qrCode);
            //file removed
        } catch (err) {
            console.error(err);
        }
    }
})();

QR.on('create', function (file, stats) {
    const bitmap = fs.readFileSync(file);
    const bit = new Buffer.from(bitmap).toString('base64');

    io.emit('qr_Created', { src: file, status: 'created' });
});

QR.on('change', function (file, stats) {
    const bitmap = fs.readFileSync(file);
    const bit = new Buffer.from(bitmap).toString('base64');

    io.emit('qr_Updated', { src: bit });
});
