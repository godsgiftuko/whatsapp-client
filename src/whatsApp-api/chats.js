const moment = require('moment');
const { storage } = require('../utils/storage.handler');

module.exports = function (instance) {
    const { io } = require('../../app');

    instance.on('message', async (msg) => {
        try {
            const chat = await msg.getChat();
            const { unreadCount, timestamp, name, isGroup } = chat;
            const contact = await msg.getContact();

            const metaData = {
                unreadCount,
                user: name,
                identifier: contact.number,
                timestamp: moment().format('lll'),
                messages: msg.body,
            };

            if (msg.isStatus || isGroup) return;

            const response = `Hi Mr. ${name}! How are you today?`;
            chat.sendMessage(metaData.identifier, response);

            io.emit('message', {
                status: 'success',
            });

            const query = {
                contactId: contact.number,
            };

            const isSaved = await storage.set({ metaData });
            const getAll = await storage.get();

            console.log(getAll);

            if (isSaved) {
                console.log('Chat saved');
            }
        } catch (error) {
            console.log('An error occured in the chats.js module', error.name);
        }
    });
};
