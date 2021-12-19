const {
    landing,
    qrCode,
    messages,
    getMessages,
} = require('../middlewares/page');

module.exports = function (app) {
    const router = app.Router();
    router.get('/', landing);
    router.get('/qrcode', qrCode);
    router.get('/messages', messages);
    router.get('/chats', getMessages);

    return router;
};
