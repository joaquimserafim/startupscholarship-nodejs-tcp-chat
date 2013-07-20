/*global require*/
/*global exports*/
/*global console*/
/**
 * external modules
 */
var moment = require('moment');// javascript date library for parsing, validating, manipulating, and formatting dates
/**
 * log level
 */
exports.level = {
	Error: "ERROR",
	Warning: "WARN",
	Info: "INFO",
	Debug: "DEBUG"
};
/**
 * format log output
 * export
 */
exports.log = function (app, level, log) {// Sat, 20 Oct 2012 16:12:08 GMT
	console.log("%s GMT - [%s] - %s: %s", moment.utc().format('YYYY-MM-DD HH:mm:ss:SSS'), app, level, log);// stdout
};