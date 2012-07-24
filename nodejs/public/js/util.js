// To support using nodejs modules that do module.exports = ...
var module = {};

var Util = {
Text: (function Text(){
	var http_matcher = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
	var www_matcher = /(^|[^\/])(www\.[\S]+(\b|$))/gim;
	var mail_to_matcher = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;
   var image_suffix_matcher = /\.(gif|jpg|jpeg|png|tiff|tif|svg|mini|thumbnail|standard|medium|large|huge)/gim;
	var my_name = (window.Me && Me.name && Me.name.toLowerCase()) || '';
	var filter = (function(){
		var f = window.UiOptions && UiOptions.wordFilter;
		return f && new RegExp(f.join('|'), 'gi');
	})();
	
	return {
		newlineMatcher: /\n|\r\n/gim,
		
		linkify: function(text){
         var tmp = this.imageDisplay(text);
         if (text != tmp) {
            return tmp;
         }
			text = text.replace(http_matcher, '<a href="$1" target="_blank">$1</a>');
			text = text.replace(www_matcher, '$1<a href="http://$2" target="_blank">$2</a>');
			text = text.replace(mail_to_matcher, '<a href="mailto:$1">$1</a>');
			return text
		},
		
		linkifyTest: function(text){
			return this.httpMatch(text) ||
			       this.wwwMatch(text) ||
			       this.mailtoMatch(text);
		},

      // We need these four match methods because regex.test() is buggy when
      // you reuse a regex object. Other regex functions are fine though...
      httpMatch: function(text) {
         return (/(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim).test(text);
      },

      wwwMatch: function(text) {
         return (/(^|[^\/])(www\.[\S]+(\b|$))/gim).test(text);
      },

      mailtoMatch: function(text) {
         return (/(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim).test(text);
      },

      imageSuffixMatch: function(text) {
         return (/\.(gif|jpg|jpeg|png|tiff|tif|svg|mini|thumbnail|standard|medium|large|huge)/gim).test(text);
      },
		
		mentionMatcher: function(text){
			var matches = text.match(/@([^\s]+)/g);
			return matches && matches.some(function(match){
				match = match.substr(1);
				return match.length >= 2 && my_name.indexOf(match.toLowerCase()) >= 0;
			});
		},
      
      imageDisplay: function(text){
         if (this.httpMatch(text) || this.wwwMatch(text)) {
            if (this.wwwMatch(text))
               text = 'http://' + text;

            if (this.imageSuffixMatch(text)) {
               text = text.replace(http_matcher, '<a href="$1" target="_blank"><img src="$1" style="max-width: 100%; max-height: 800px;" /></a> ');
            }
         }
         return text;
      },
		
		wordFilter: function(text){
			if(!filter) return text;
			return text.replace(filter, function(m) {
				return Array(m.length+1).join("*");
			});
		}
	};
})(),

nextTick: function(f){
	return setTimeout(f,0);
},

ts:function(){
	return new Date().getTime();
},

time:function time(t){
	var H = t.getHours(),
			h = H % 12,
			m = t.getMinutes();
	
	return (h==0 ? 12 : h) + ":" + (m < 10 ? '0' + m : m) + (H > 11 ? 'pm' : 'am');
},

date:function date(t){
	var d = t.getDate(),
	    m = t.getMonth() + 1;
	
	return m + "/" + (d < 10 ? '0' + d : d);
},

url:function(){
	return window.location.href.split('?')[0];
},

inherits:function(to, from){
	$.extend(to.prototype, from.prototype, {_super: from});
}
};

if(window.EventEmitter){
	EventEmitter.prototype.muteEvents = function(fn){
		this.emit = function(){}
		fn();
		delete this.emit;
	}
}
