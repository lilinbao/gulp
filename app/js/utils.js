
var Utils = {
		getCookie : function(cname){
			"use strict";
			var name = cname + "=";
			var ca = document.cookie.split(';');
			for (var i = 0; i < ca.length; i++) {
				var c = ca[i];
				while (c.charAt(0) == ' ') c = c.substring(1);
				if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
			}
			return "";
		},
		setCookie : function(cname, cvalue, exdays){
			"use strict";
			var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
		},
		getUrlParameter : function getUrlParameter(sParam) {
			"use strict";
			var sPageURL = decodeURIComponent(window.location.search.substring(1)),
				sURLVariables = sPageURL.split('&') || sPageURL,
				sParameterName,
				i;
			for (i = 0; i < sURLVariables.length; i++) {
				sParameterName = sURLVariables[i].split('=');
				if (sParameterName[0] == sParam) {
					return sParameterName[1];
				}
			}
			return '';
		},

		stringReplace : function(str,item){
			"use strict";
			return str.replace(/\$\w+\$/gi, function(matches){	
				var value = item[matches.replace(/\$/g,'')];

				return !typeof(value) ? '': value;
			});
		}
};

window.Utils = Utils;