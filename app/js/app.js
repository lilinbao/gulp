/* globals Utils */
/* globals $: jQuery */
var App = (function(){
	"use strict";
	var checkSourceReferrer = function(){
		var docref = document.referrer || "direct";
	    var n = docref.indexOf(window.location.origin);
	    if (!~n) {
	    	Utils.setCookie("incoming",docref);
	    	Utils.setCookie('oqs', window.location.search.substr(1));
	    }else{
	        var origin_incoming = Utils.getCookie('incoming');
	        if(origin_incoming && !Utils.getCookie('oqs')) {
	        	Utils.setCookie('oqs', window.location.search.substr(1));
	        }
	        if(!origin_incoming)
	        	Utils.setCookie("incoming","direct");
	    }
	};
	var getAllQueryParameters = function(){
		var parameters = {
			UTM_term		: Utils.getUrlParameter('UTM_term'),
			UTM_group		: Utils.getUrlParameter('UTM_group'),
			UTM_source		: Utils.getUrlParameter('UTM_source'),
			UTM_medium		: Utils.getUrlParameter('UTM_medium'),
			UTM_content		: Utils.getUrlParameter('UTM_content'),
			UTM_campaign	: Utils.getUrlParameter('UTM_campaign'),
			source_refferer : Utils.getCookie('incoming')
		};
		window.console.log('UTM_term = ' + parameters.UTM_term);
		return parameters;
	};
	var assembleTargetURL = function(){
		var url = '';
		var parameters = getAllQueryParameters();
		var appflyerRemoteTemplate = 'http://app.appsflyer.com/{app_id}/?pid={LP ID}&c=$UTM_campaign$&af_sub1=$UTM_medium$&af_sub2=$UTM_group$&af_keywords=$UTM_term$&af_sub3=$source_refferer$&af_channel=$UTM_source$&af_ad_type=$UTM_content$&af_r=$redirection URL$';
		for(var property in parameters){
			if(parameters.hasOwnProperty(property)){
				url = Utils.stringReplace(appflyerRemoteTemplate, parameters);
			}
		}
		window.console.log('assembled url is ' + url);
		return url;
	};
	var attachEventOnStartup = function(){
		$('.btn-download').on('click', function(){
			window.console.log('btn-download has been clicked');
			
			var target = assembleTargetURL();
			window.location.href = target;
			/* globals mixpanel : this will be init by browser environment*/
			if(mixpanel){
				mixpanel.track("LP_APP_download",{
                	"Page Name": "ACL Pilot Page"
            	});
			}
		});
	};
	return {
		init: function(){
			checkSourceReferrer();
			attachEventOnStartup();
		},
		testAssembleTargetURL: function(){
			assembleTargetURL();
		}
	};
});	

$(function(){
	"use strict";
	window.app = new App();
	app.init();
	window.console.log('jjjj');
});