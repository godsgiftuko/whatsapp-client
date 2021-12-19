const Chats_Model = require('../database/chats.schema');

module.exports = function (instance) {
    const { io } = require('../../app');
    // console.log(instance);

    try {
        instance.on('message', async (msg) => {
            const chat = await msg.getChat();
            const { unreadCount, timestamp, name, isGroup } = chat;

            console.log(msg);

            if (msg.isStatus || isGroup) return;

            const response = `Hi Mr. ${name}! How are you today?`;
            const contact = await msg.getContact();
            chat.sendMessage(response);
            const metaData = {
                unreadCount,
                timestamp,
                message: msg.body,
            };

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
            newChat.timestamp = timestamp;
            newChat.unreadCount = unreadCount;

            await newChat.save((err) => {
                if (err) throw err;

                console.log('Chat saved');
            });
            // if (isExist) {
            //     await Chats_Model.updateOne(query, {
            //         $push: {
            //             messages: metaData,
            //         },
            //     });
            // } else {
            // }

            // chat.sendSeen();
            // client.sendMessage(number, message);

            // if (msg.body.startsWith('!desc ')) {
            //     // Change the group description
            //     let chat = await msg.getChat();
            //     if (chat.isGroup) {
            //         let newDescription = msg.body.slice(6);
            //         chat.setDescription(newDescription);
            //     } else {
            //         msg.reply('This command can only be used in a group!');
            //     }
            // }

            // console.log(chat);
            // console.log(name, id.user, msg.body);
        });
    } catch (err) {
        console.log(err);
    }
};
