const cp = require('child_process');
const EventEmitter = require('events');
class Emitter extends EventEmitter {}
const eventEmitter = new Emitter();

// const     grunt = cp.spawn('grunt', ['--force', 'default', 'watch'])

exports.event = {
    on(eventType, callback) {
        let eventHandler;
        eventEmitter.once(eventType, (...args) => {
            switch (eventType) {
                case 'qrChanged':
                    qrQueue(eventType, args);
                    break;

                default:
                    return eventType;
                    break;
            }
        });

        eventEmitter.on('error', (error) => {
            if (error) {
                eventHandler = new Error('Error occurred');
            }
            console.log('Error occurred');
        });
    },
};

function qrQueue(eventType, callback) {
    console.log(callback);
    // const queue = [];
    // queue.push(callback)
    // if (callback) {
    //     callback();
    //     return;
    // }
    // return () => {
    //     check: queue;
    // };
    eventEmitter.emit(eventType instanceof Error ? 'error' : eventType);
}

eventEmitter.removeAllListeners();
