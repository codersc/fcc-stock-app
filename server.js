const yahooFinance = require('yahoo-finance');
var path = require('path');
var express = require('express')
var app = express()
var server = require('http').createServer(app);
var io = require('socket.io')(server);

io.on('connection', (socket) => {
	socket.on('search', (data) => {
		socket.broadcast.emit('update', data);
	});

	socket.on('remove', (data) => {
		socket.broadcast.emit('removal', data);
	})
});

app.use(express.static(path.join(__dirname, '/dist')));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/dist/index.html');
});

app.get('/api/:ticker', (req, res) => {
	yahooFinance.historical({
		symbol: req.params.ticker,
		from: '2012-01-01',
		to: '2017-01-31' 
	}, function (err, quotes) {
		res.json(quotes);
	});	
});

const port = process.env.PORT || 3000;

server.listen(port, function () {
	console.log('Server listening...');
});
