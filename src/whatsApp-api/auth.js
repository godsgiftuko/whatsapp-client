const fs = require('fs');
const path = require('path');
const { progress } = require('../utils/progress');
const { dirname, join } = require('path');
const appDir = dirname(require.main.filename);

module.exports = function ({ whatsappWeb, qrcode, showCliProgress = true }) {
    const { io } = require('../../app');
    const { Client, ChatTypes, MessageAck } = whatsappWeb;
    const fileName = __filename.replace(/\\/g, ' ').split(' ').pop();

    // Path where the session data will be stored
    const SESSION_FILE_PATH =
        path.dirname(require.main.filename) + '/session.json';
    // Load the session data if it has been previously saved
    let sessionData;

    return new Promise(async (resolve, reject) => {
        let client = undefined;
        progress.start(showCliProgress);
        if (fs.existsSync(SESSION_FILE_PATH)) {
            sessionData = require(SESSION_FILE_PATH);

            const CLIENT_CONFIG = {
                session: sessionData,
                puppeteer: {
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox',
                        '--use-gl=egl',
                    ],
                    ignoreDefaultArgs: ['--disable-extensions'],
                },
            };

            try {
                client = new Client(CLIENT_CONFIG);

                client.on('authenticated', (session) => {
                    console.log('authenticated');
                    return resolve(client);
                });

                // client.on('auth_failure', () => generateQR());

                client.on('disconnected', (reason) => {
                    generateQR();
                    console.log('Client was logged out', reason);
                });

                client.initialize();
            } catch (error) {
                return reject({
                    message: error,
                    path: path.basename(fileName),
                    fileName,
                });
            }
        } else {
            console.log('session file does not exits');
            const generatedQR = generateQR();
            return resolve(generatedQR);
            // return resolve(client);
        }
    });

    function generateQR(instance = new Client()) {
        return new Promise((resolve, reject) => {
            try {
                instance.on('qr', async (qr) => {
                    // qrcode.generate(qr, { small: true });

                    const { config, Qrcode } = qrcode;

                    const src = `./public/images/generatedQR.png`;
                    const stream = fs.createWriteStream(src);
                    const code = Qrcode.toFileStream(stream, qr);

                    return resolve(instance);
                });

                instance.on('Status', (res) => {
                    console.log(res);
                });

                instance.on('authenticated', (session) => {
                    fs.writeFile(
                        SESSION_FILE_PATH,
                        JSON.stringify(session),
                        (err) => {
                            if (err) {
                                reject({
                                    message: error,
                                    path: path.basename(fileName),
                                    fileName,
                                });
                            }
                        }
                    );
                });

                instance.on('ready', async () => {
                    const qrPath = appDir + '/public/images/generatedQR.png';

                    try {
                        fs.unlinkSync(qrPath);
                    } catch (err) {
                        console.error(err);
                    }

                    console.log('**************QR DELETED**************');
                    progress.stop();
                    io.emit('success', { url: '/messages', timer: 3000 });

                    console.log('Client started');
                });
                instance.initialize();
            } catch (error) {
                return reject({
                    message: error,
                    path: path.basename(fileName),
                    fileName,
                });
            }
        });
    }
};
