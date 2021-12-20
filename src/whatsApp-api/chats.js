const Chats_Model = require('../database/chats.schema');
const moment = require('moment');

module.exports = function (instance) {
    const { io } = require('../../app');

    try {
        instance.on('message', async (msg) => {
            const chat = await msg.getChat();
            const { unreadCount, timestamp, name, isGroup } = chat;

            console.log(msg);

            const metaData = {
                unreadCount,
                timestamp,
                message: msg.body,
            };

            if (msg.isStatus || isGroup) return;

            // if (isGroup) {

            // }

            const response = `Hi Mr. ${name}! How are you today?`;
            const contact = await msg.getContact();
            chat.sendMessage(response);

            io.emit('message', {
                status: 'success',
            });

            const query = {
                contactId: contact.number,
            };

            const isExist = await Chats_Model.exists(query);

            console.log('Does contact exits? ' + isExist);
            const newChat = new Chats_Model();

            newChat.contactId = contact.number;
            newChat.contactName = name;
            newChat.messages = msg.body;
            newChat.timestamp = moment().format('lll');
            newChat.unreadCount = unreadCount;

            await newChat.save((err) => {
                if (err) throw err;

                console.log('Chat saved');
            });
        });
    } catch (err) {
        console.log('error');
    }
};
