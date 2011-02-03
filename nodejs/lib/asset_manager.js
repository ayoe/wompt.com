var assetManager = require('connect-assetmanager');
var assetHandler = require('connect-assetmanager-handlers');

var assetManagerGroups = {
	'landing_js': {
		'route': /\/js\/landing_[\d]+.js/
		, 'path': './public/'
		, 'dataType': 'javascript'
		, 'files': [
			'/external/events.js'
		]
	},		
	'channel_js': {
		'route': /\/js\/channel_[\d]+.js/
		, 'path': './'
		, 'dataType': 'javascript'
		, 'files': [
			'public/external/events.js'
			, 'vendor/Socket.IO/socket.io.js'
			, 'public/js/client.js'
			, 'public/external/json2.js'
		]
	}, 'all_css': {
		'route': /\/css\/all_[0-9]+\.css/
		, 'path': './public/css/'
		, 'dataType': 'css'
		, 'files': [
			'base.css'
			, 'landing.css'
			, 'twitter.css'
		]
		, 'preManipulate': {
			// Regexp to match user-agents including MSIE.
			'MSIE': [
				assetHandler.yuiCssOptimize
				, assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.stripDataUrlsPrefix
			],
			// Matches all (regex start line)
			'^': [
				assetHandler.yuiCssOptimize
				, assetHandler.fixVendorPrefixes
				, assetHandler.fixGradients
				, assetHandler.replaceImageRefToBase64('public')
			]
		}
	}
};

module.exports = {
	middleware: assetManager(assetManagerGroups)
}