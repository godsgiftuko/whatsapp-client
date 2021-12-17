var qs = require('querystring');
var http = require('https');
() => {
    var options = {
        method: 'POST',
        hostname: 'api.ultramsg.com',
        port: null,
        path: '/instance1366/messages/voice',
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
        },
    };

    var req = http.request(options, function (res) {
        var chunks = [];

        res.on('data', function (chunk) {
            chunks.push(chunk);
        });

        res.on('end', function () {
            var body = Buffer.concat(chunks);
            console.log(body.toString());
        });
    });

    req.write(
        qs.stringify({
            token: '1e56qa9pkvp1jjmf',
            to: '+2348135247490',
            audio: 'https://file-example.s3-accelerate.amazonaws.com/voice/oog_example.ogg',
        })
    );
    req.end();
};
