var Hoptoad = require('hoptoad-notifier').Hoptoad
  ,	env = require('../environment')
  , shouldReport = env.hoptoad && env.hoptoad.reportErrors;
	
	
if(shouldReport){
	Hoptoad.key = env.hoptoad.apiKey;
	process.addListener('uncaughtException', function(err) {
		Hoptoad.notify(err, function(){});
	});
}

Hoptoad.expressErrorNotifier = function(err,req,res,next){
	if(shouldReport)
		Hoptoad.notify(err, function(){});
	next(err);
}

module.exports = Hoptoad;