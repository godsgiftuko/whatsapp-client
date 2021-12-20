const express = require('express');
const exHBS = require('express-handlebars');
const { config } = require('dotenv');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const routers = require('./src/routers/pages')(express);
const { connectDB } = require('./src/database/mongoDB');
const whatsAPP = require('./src/whatsApp-api/app')();

const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require('socket.io');
const io = new Server(server);

// APP CONFIG
config();
app.set('PORT', process.env.PORT || 3000);
app.engine(
    'hbs',
    exHBS.engine({
        defaultLayout: 'main',
        layoutsDir: './src/views/layout',
        extname: '.hbs',
    })
);

app.set('view engine', 'hbs');
app.set('views', __dirname + '/src/views');
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routers);

//socket
io.on('connection', (socket) => {
    console.log('ws: Connected');
});

(async () => {
    const dataBase = await connectDB();

    if (dataBase) {
        return io.emit('status', {
            status: {
                db: dataBase ? true : false,
            },
        });
    }
    io.emit('disconnected', { msg: 'disconnected' });
})();

server.listen(app.get('PORT'), () =>
    console.log(`Server running on port ${app.get('PORT')}`)
);

exports.io = io;
exports.app = app;
