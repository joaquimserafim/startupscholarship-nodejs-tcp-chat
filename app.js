/**
 * Created with IntelliJ IDEA.
 * User: joaquimserafim
 * Date: 12/07/13
 * Time: 01:12
 * To change this template use File | Settings | File Templates.
 */
/*global require*/
/**
 * Node core modules
 */
var net = require('net');
/**
 * internal modules
 */
var logger = require('./log');// log - local module

// TCP Server
(function () {
	var serverPort = 9000;// server port
	var clients = [];// keep clients
	/**
	 * TCP server
	 */
	var server = net.createServer(function (socket) {
		// socket client
		var client = [socket.remoteAddress, ':', socket.remotePort].join('');
		// save
		clients.push(socket);
		/**
		 * [socket events]
		 */
			// Emitted when the other end of the socket sends a FIN packet
		socket.on('end', function () {
			logger.log('', logger.level.Info, ['socket.client.disconnect - address:', client].join(''));
		});
		// Emitted once the socket is fully closed. The argument had_error is a boolean which says if the socket was closed due to a transmission error
		socket.on('close', function (had_error) {
			logger.log('', logger.level.Info, ['socket.client.close - address:', client].join(''));
			// find the closed socket
			var indexSocket = clients.indexOf(socket);
			// remove socket from clients array
			clients.splice(indexSocket, 1);
		});
		// Emitted when an error occurs. The 'close' event will be called directly following this event
		socket.on('error', function (error) {
			logger.log('', logger.level.Error, ['socket.client.error - address:', client].join(''));
		});
		// Emitted when data is received
		socket.on('data', function (buffer) {
			var rx = buffer.toString().replace('\r\n', '');// rx data cast from Buffer to String
			logger.log('', logger.level.Info, ['socket.client.data - address:', client, ', length:', buffer.length, ', data:', rx].join(''));
			// broadcast for all clients
			clients.forEach(function (s) {
				if (s !== socket) {
					s.write(rx.concat('\n'));
				}
			});
		});
	});
	/**
	 * server events
	 */
	// Emitted when the server has been bound after calling server.listen
	server.on('listening', function () {
		logger.log('', logger.level.Info, 'listening - address:'.concat(JSON.stringify(server.address())));
	});
	// Emitted when a new connection is made
	server.on('connection', function (socket) {
		logger.log('', logger.level.Info, 'new connection:'.concat([socket.remoteAddress, ':', socket.remotePort].join('')));
	});
	// Emitted server close connection
	server.on('close', function () {
		logger.log('', logger.level.Info, 'closed');
	});
	// Emitted when an error occurs. The 'close' event will be called directly following this event
	server.on('error', function (error) {
		logger.log('', logger.level.Error, 'msg:'.concat(error));
	});
	// launch server
	server.listen(serverPort);
})();



