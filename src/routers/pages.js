const {
    landing,
    qrCode,
    messages,
    getMessages,
    endSession,
    deleteMsg,
} = require('../middlewares/page');
const { isAuth } = require('../middlewares/auth');

module.exports = function (app) {
    const router = app.Router();
    router.get('/', landing);
    router.get('/qrcode', qrCode);
    router.get('/messages', messages);
    router.get('/data', getMessages);
    router.get('/logout', endSession);
    router.delete('/delete/:ref', deleteMsg);

    return router;
};
