const cliProgress = require('cli-progress');

const ProgressTrace = () => {
    let sec = 1;

    const opt = {
        format: `progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}`,
    };

    const b1 = new cliProgress.SingleBar(
        {
            format: 'progress [{bar}] {percentage}% | ETA: {eta}s | {value}/{total}',
        },
        cliProgress.Presets.shades_classic
    );

    return {
        start(instruct) {
            // console.log('Please wait...');
            if (!instruct) return;

            b1.start(100, 0, {
                speed: 3,
            });

            b1.increment();

            const interval = setInterval(() => {
                b1.update(sec++);
            }, 100);
        },

        stop() {
            b1.stop();
        },
    };
};

module.exports.progress = ProgressTrace();
