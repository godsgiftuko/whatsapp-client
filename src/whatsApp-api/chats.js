module.exports = function (instance) {
    // console.log(instance);

    instance.on('message', async (msg) => {
        const chat = await msg.getChat();

        const contact = await msg.getContact();
        chat.sendMessage(contact.number, `Hi @${contact.number}!`);

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

        const { name, id } = chat;

        console.log(chat);
        console.log(name, id.user, msg.body);
    });
};
