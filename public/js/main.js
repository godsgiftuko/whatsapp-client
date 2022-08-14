'use strict';

// const socketIo = new WebSocket('ws://localhost:3001');

$(function () {
    // $.get('/qrcode', function (response) {
    // });

    function doOnlineCheck() {
        $.ajax({
            url: '/qrcode',
            method: 'GET',
            beforeSend() {
                // $('.spinner-wrapper').removeClass('d-none');
                $('#qrcode-image').show();
                console.log('loading');
            },
            success(response) {
                console.log(response);

                // const url = response?.url.replace(/[0-9]/g, '');
                $('.spinner-wrapper').addClass('d-none');

                $('.qr-code-scanner').append(
                    `<img id="qrcode-image" height="200" width="200" src="" alt=""></img>`
                );

                $('#qrcode-image').hide();
                $('#qrcode-image').attr('src', response.url).show();
            },
        });
    }

    // doOnlineCheck();
});
