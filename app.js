const express = require('express');
const exHBS = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const routers = require('./src/routers/pages')(express);
const http = require('http');
const server = http.createServer(app);
const { Server, Socket } = require('socket.io');
const io = new Server(server);

// APP CONFIG
app.set('PORT', process.env.PORT || 3000);
const env = process.env.DATABASE_HOST == 'localhost' ? 'http://localhost:' + app.get('PORT') + '/' : process.env.DATABASE_HOST;
app.set('ENV', env);
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
    console.log('Socket connected!');
});

exports.self = { server: server, app: app, io };
