const express = require('express');
const exHBS = require('express-handlebars');
const { config } = require('dotenv');
const path = require('path');
const app = express();
const routers = require('./src/routers/pages')(express);

const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require('socket.io');
const io = new Server(server);

exports.io = io;
exports.app = app;

io.on('connection', (socket) => {
    console.log('ws:// Connected to port' + app.get('PORT'));
});
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
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routers);

server.listen(app.get('PORT'), () =>
    console.log(`Server running on port ${app.get('PORT')}`)
);
