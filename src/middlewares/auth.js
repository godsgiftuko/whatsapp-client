const utils = require('../utils/utils');
const exists = async () => (await utils.fileExists('./session.json'));

exports.isAuth =  (req, res, next) => {
console.log(res, 'it exits')
        if (exists) {
            next()
            return
        }
         res.redirect('/');

    // exists().then((res) => {
    //     console.log(res, 'it exits')
    // })
}