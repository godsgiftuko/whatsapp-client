const { event } = require('./events');

setInterval(() => {
    event.on('onChange', () => {
        console.log('Hello world');
    });
}, 5000);
