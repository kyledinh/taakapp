// kjs library to handle dom parsing

var kjs = (function() {
    "use strict"; 
    var api = {};

    api.id = function(id) { 
        return document.getElementById(id); 
    };

    api.create = function(tag, innerHtml, attr, value) {
        var elem = document.createElement(tag);
        elem.innerHTML = innerHtml;
        if ((attr !== null) && (attr !== "")) {
            elem.setAttribute(attr, value);
        }
        return elem;
    };

    api.create = function(tag, innerHtml) {
        var elem = document.createElement(tag);
        elem.innerHTML = innerHtml;
        return elem;
    };

    api.clone = function(node, id) {
        var elem = node.cloneNode(true);
        if ((id !== "") && (id !== null)) {
            elem.setAttribute("id", id);
        } else {
            elem.removeAttribute("id");
        }
        return elem;
    };  
  
    api.initAjax = function(uri, callback) {
        var ajax = new api.ajaxRequest(); 	
        ajax.onreadystatechange = function() {	
            if (ajax.readyState == 4 && ajax.status == 200) {
                var jsondata = JSON.parse(ajax.responseText);
                if (callback) {   
            	    callback(jsondata); 
                }     	
    	    }
        }
        ajax.open("GET", uri, true);
        ajax.send(null);
    }

    api.ajaxRequest = function() {
        var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"] //activeX versions to check for in IE
        if (window.ActiveXObject) { //Test for support for ActiveXObject in IE first (as XMLHttpRequest in IE7 is broken)
            for (var i=0; i < activexmodes.length; i++) {
                try {
                    return new ActiveXObject(activexmodes[i]);
                   } catch(e) {
                    //suppress error
                }
            }
        } else if (window.XMLHttpRequest) { // if Mozilla, Safari etc
            return new XMLHttpRequest();
        } else {
            return false;
        }
    }

    return api;

})();
