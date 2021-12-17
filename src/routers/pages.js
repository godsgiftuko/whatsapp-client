const { landing, qrCode, messages } = require('../middlewares/page');

module.exports = function (app) {
    const router = app.Router();
    router.get('/', landing);
    router.get('/qrcode', qrCode);
    router.get('/messages', messages);

    return router;
};
