const fs = require('fs');
const path = require('path');
const { progress } = require('../utils/progress');
const { dirname, join } = require('path');
const appDir = dirname(require.main.filename);
const { Storage } = require("../utils/storage.handler");
const storage = Storage()

module.exports = function ({ whatsappWeb, qrcode, showCliProgress = true }) {
    try {
        const { Client, ChatTypes, MessageAck } = whatsappWeb;
        const fileName = __filename.replace(/\\/g, ' ').split(' ').pop();
        // Path where the session data will be stored
        const SESSION_FILE_PATH =
            path.dirname(require.main.filename) + '/session.json';
        // Load the session data if it has been previously saved
        let sessionData;
        const { self } = require('../../app');
        const { io } = self;

        return new Promise(async (resolve, reject) => {
            let client = undefined;
            progress.start(showCliProgress);
            console.log(`Preparing whatsapp service \n Please wait... \n `)
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
                        try {
                            console.log(`whatsApp connected!`);
                            progress.stop();
                            io.emit('success', {
                                url: '/messages',
                                timer: 3000,
                            });
                            return resolve(client);
                        } catch (error) {
                            console.log(
                                'An error occured on whatsApp authentication in auth.js' +
                                    '\n' +
                                    error
                            );
                        }
                    });

                    client.on('auth_failure', () => {
                        try {
                            // resolve(client)
                            generateQR();
                            console.log('Authentication failed. Generating new QR')
                        } catch (error) {
                            console.log(
                                'An error occured while generating a QR code for you in auth.js' +
                                    '\n' +
                                    error
                            );
                        }
                    });

                    client.on('disconnected', (reason) => {
                        try {
                            generateQR();
                            console.log('Client was logged out', reason);
                        } catch (error) {
                            console.log(
                                'An error occured while disconnecting from your whatsApp. Please Try Again.' +
                                    '\n' +
                                    error
                            );
                        }
                    });

                    client.initialize();
                } catch (error) {
                    console.log(
                        'Unable to start WhatsApp engine. Please Try Again.' +
                            '\n' +
                            error
                    );
                    // return reject({
                    //     message: error,
                    //     path: path.basename(fileName),
                    //     fileName,
                    // });
                }
            } else {
                try {
                    const generatedQR = generateQR();
                    return resolve({
                        hadSession: true,
                        generatedQR
                    });
                } catch (error) {
                    console.log(
                        'An error occured while generating QR code in auth.js in generateQR()' +
                            '\n' +
                            error
                    );
                }
                // return resolve(client);
            }
        });

        function generateQR() {
            return new Promise((resolve, reject) => {
                try {
                    const instance = new Client();

                    instance.on('qr', async (qr) => {
                        try {
                            const [isAuthenicated] = await storage.get({ table: 'sessions', order: false })
                            
                            if (isAuthenicated) return resolve(instance);

                            const { config, Qrcode } = qrcode;

                            const src = `./public/images/generatedQR.png`;
                            const stream = fs.createWriteStream(src);
                            const code = Qrcode.toFileStream(stream, qr);
                            
                            console.log('Please scan QR on your browser,');
                            io.emit('QR', {
                               msg: 'QR created'
                            });
                            return resolve(instance);
                        } catch (error) {
                            console.log(
                                'An error occured while requesting for QR code in auth.js at generateQR()' +
                                    '\n' +
                                    error
                            );
                        }
                    });

                    instance.on('authenticated', async (session) => {
                        try {
                            const isSaved = await storage.set({table: 'sessions', metaData: {
                                session: JSON.stringify(session)
                            }})
    
                        } catch (error) {
                            console.log(
                                'An error occured while authenticating whatsApp session in auth.js at generateQR()' +
                                    '\n' +
                                    error
                            );
                        }
                    });
                    instance.on('ready', async () => {
                        try {
                            const qrPath =
                                appDir + '/public/images/generatedQR.png';
                            fs.unlinkSync(qrPath);
                            console.log(
                                '**************Login Successful**************'
                            );
                            progress.stop();
                            io.emit('success', {
                                url: '/messages',
                                timer: 3000,
                            });

                            console.log(
                                'Client Ready => Hoop to your browser.'
                            );
                        } catch (err) {
                            console.log(
                                'At on ready an error occured in auth.js at generateQR()' +
                                    '\n' +
                                    err
                            );
                        }
                    });

                    instance.initialize();
                } catch (error) {
                    console.log(
                        'An error occured while initializing whatsApp in auth.js at generateQR()' +
                            '\n' +
                            error
                    );
                }
            });
        }
    } catch (error) {
        console.log(
            'Unable to reach whatsApp service. Please Try Again' + '\n' + error
        );
    }
};

