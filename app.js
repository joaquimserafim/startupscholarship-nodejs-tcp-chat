/**
 * Node core modules
 */
var net = require('net');
/**
 * internal modules
 */
var logger = require('./log');// log

// TCP Server
(function () {
	var serverPort = 9000;// server port
	var clients = [];// keep clients
	/**
	 * TCP server
	 */
	var server = net.createServer(function server(socket) {
		// socket client
		var client = [socket.remoteAddress, ':', socket.remotePort].join('');
		// save
		clients.push(socket);
		/**
		 * [socket events]
		 */
			// Emitted when the other end of the socket sends a FIN packet
		socket.on('end', function socketEnd() {
			logger.log('', logger.level.Info, ['socket.client.disconnect - address:', client].join(''));
		});
		// Emitted once the socket is fully closed. The argument had_error is a boolean which says if the socket was closed due to a transmission error
		socket.on('close', function socketClose(had_error) {
			logger.log('', logger.level.Info, [
				'socket.client.close - address:',
				client,
				', with error ',
				had_error
			].join(''));
			// find the closed socket
			var indexSocket = clients.indexOf(socket);
			// remove socket from clients array
			clients.splice(indexSocket, 1);
		});
		// Emitted when an error occurs. The 'close' event will be called directly following this event
		socket.on('error', function socketError(error) {
			logger.log('', logger.level.Error, [
				'socket.client.error - address:',
				client,
				', error ',
				error
			].join(''));
		});
		// Emitted when data is received
		socket.on('data', function socketData(buffer) {
			var rx = buffer.toString().replace('\r\n', '');// rx data cast from Buffer to String
			logger.log('', logger.level.Info, ['socket.client.data - address:', client, ', length:', buffer.length, ', data:', rx].join(''));
			// broadcast for all clients
			clients.forEach(function iterator(cl) {
				if (cl !== socket) {
					cl.write(rx.concat('\n'));
				}
			});
		});
	});
	/**
	 * server events
	 */
	// Emitted when the server has been bound after calling server.listen
	server.on('listening', function serverListening() {
		logger.log('', logger.level.Info, 'listening - address:'.concat(JSON.stringify(server.address())));
	});
	// Emitted when a new connection is made
	server.on('connection', function serverConnection(socket) {
		logger.log('', logger.level.Info, 'new connection:'.concat([socket.remoteAddress, ':', socket.remotePort].join('')));
	});
	// Emitted server close connection
	server.on('close', function serverClose() {
		logger.log('', logger.level.Info, 'closed');
	});
	// Emitted when an error occurs. The 'close' event will be called directly following this event
	server.on('error', function serverError(error) {
		logger.log('', logger.level.Error, 'msg:'.concat(error));
	});
	// launch server
	server.listen(serverPort);
})();



