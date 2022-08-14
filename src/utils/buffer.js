module.exports = {
    encode: (data) => {
        return Buffer.from(data, 'utf8').toString('base64');
    },
    decode:(data) => {
        return Buffer.from(data, 'base64').toString('utf8');
    },
}