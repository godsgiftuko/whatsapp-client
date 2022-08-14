const moment = require('moment');
const { Storage } = require('../utils/storage.handler');
const { v4: uuidv4 } = require('uuid');
const storage = Storage()

module.exports = function (instance) {
    const { self } = require('../../app');
    const { io } = self;
    instance.on('message', async (msg) => {
        try {
            const chat = await msg.getChat();
            const { unreadCount, timestamp, name, isGroup } = chat;
            const contact = await msg.getContact();

            const senderName = name !== '' ? name : 'UNSAVED_' + Math.floor(Math.random() * 10000000);
            const metaData = {
                // msgId: uuidv4(),
                unreadCount,
                user: senderName || contact.number,
                identifier: contact.number,
                timestamp: moment().format('lll'),
                messages: msg.body,
                type: msg.type
            };

            if (msg.isStatus || isGroup) return;

            if (msg.hasMedia) {
                const isMedia = await msg.downloadMedia()
                //  console.log(msg.type, mimetype, data);
                // switch (msg.type) {
                //     case 'ptt':
                //         console.log('audio file', isMedia.mimetype)
                //         break;
                //     case 'image':
                //         console.log('image file', isMedia.mimetype)
                //         break;
                //     case 'sticker':
                //         console.log('sticker file', isMedia.mimetype)
                //         break;
                //     default:
                //         break;
                // }

                metaData.messages = isMedia.data 
                metaData.codec = isMedia.mimetype 
            }

            const response = `Hi ${name}! Hope you doing okay. Please ignore this message. Thanks`;
            // chat.sendSeen()
            // chat.sendMessage('🤡💩🧐');
            // chat.delete()

            io.emit('message', {
                msg: `One new ${ metaData.type == 'ptt' ? 'voice note' : metaData.type } from ${metaData.user}`,
                timer: 200
            });


            const isSaved = await storage.set({ metaData, table: 'chats' });
            const getAll = await storage.get();

        } catch (error) {
            console.log('An error occured in the chats.js module', error);
        }
    });
};
