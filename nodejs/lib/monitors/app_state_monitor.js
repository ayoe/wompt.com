var util = require('util'),
    User = require('../models/user'),
    Room = require('../models/room');

function AppStatePreparer(app){
	
	this.prepare = function(done){
		var out = {}, left = monitor_names.length;
		
		monitor_names.forEach(function(key){
			monitors[key](function(result){
				out[key] = result;
				if(--left <= 0) done(out);
			});
		});
	}
	
	var monitors = {
		clients: clientCounts
		,users: userCounts
		,channels: channelCounts
		,t: timeStamp
		,node: nodeInfo
	}, monitor_names = Object.keys(monitors);


	function clientCounts(done){
		done({
			count: app.clients.count
		});
	}
	
	function userCounts(done){
		var result = {
			connected: app.clients.userCount
		};
		User.count({},function(err, value){
			result.db = value;
			done(result);
		});
	}
	
	function channelCounts(done){
		var inuse=0, loaded=0;
		
		var namespaces = app.namespacesController;
		
		namespaces.eachNamespace(function(channels){
			loaded += channels.count;
			channels.each(function(chan){
				if(chan.clients.count > 0) inuse++;
			});
		});

		var result = {
			loaded: loaded
			,inuse: inuse
		};

		Room.count({},function(err, value){
			result.db = value;
			done(result);
		});
	}
	
	function nodeInfo(done){
		done({
			mem:process.memoryUsage()
		});
	}
	
	function timeStamp(done){ done(new Date().getTime()); }
}


function AppStateMonitor(app, options){
	var appState = new AppStatePreparer(app);

	var me = this;
	
	if(!options.disabled)
		this.timer = setInterval(tick, options.interval);
	
	function tick(){
		appState.prepare(function(result){
			me.emit('new_state', result);
			me.previousState = result;
		})
	}
}

util.inherits(AppStateMonitor, require('events').EventEmitter);


module.exports = AppStateMonitor;
