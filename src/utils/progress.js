const cliProgress = require('cli-progress');

const ProgressTrace = () => {
    let sec = 1;

    const opt = {
        format: `progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
    };

    // create new progress bar
    const b1 = new cliProgress.SingleBar(
        {
            format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
        },
        cliProgress.Presets.shades_classic
    );

    return {
        start(instruct) {
            console.log('Please wait...');
            if (!instruct) return;
            // initialize the bar - defining payload token "speed" with the default value "N/A"
            b1.start(100, 0, {
                speed: 3,
            });

            // update values
            b1.increment();

            const interval = setInterval(() => {
                b1.update(sec++);
            }, 100);
        },

        // update() {
        //     // update values
        //     b1.increment();
        //     const interval = setInterval(() => {
        //         b1.update(sec++);
        //     }, 100);
        // },

        stop() {
            // stop the bar
            b1.stop();
        },
    };
};

module.exports.progress = ProgressTrace();

// module.exports = {
//     start: progressTrace.start(),
//     update: progressTrace.update(),
//     stop: progressTrace.stop(),
// };
