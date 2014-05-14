
/* JavaScript content from js/plugins/MQTTmessagePlugin.js in folder common */
/**
 * Subscribe Topic
 * connect to MQTT broker
 * @param topic
 */
function MQTT_CONNECT(onSuccess, onError, clientID, topic){
	window.plugins.MQTTPlugin.CONNECT(onSuccess, onError, clientID, topic);
}
function MQTT_SEND_MSG(onSuccess, onError, topic, msg){
	window.plugins.MQTTPlugin.SEND_MSG(onSuccess, onError, topic, msg);
}

/**
 * MQTTmessagePlugin wrap Object
 */
function MQTTPlugin(){}

MQTTPlugin.prototype.CONNECT = function(onSuccess, onFailure, clientID,topic){
	if(typeof cordova !== "undefined")
		cordova.exec(onSuccess, onFailure, "MQTTPlugin", "CONNECT", [clientID,topic]);
};

MQTTPlugin.prototype.SEND_MSG = function(onSuccess, onFailure, topic, msg){
	if(typeof cordova !== "undefined")
		cordova.exec(onSuccess, onFailure, "MQTTPlugin", "SEND_MSG", [topic, msg]);
};

if(!window.plugins) { 
	window.plugins = {}; 
}

function connectStatus(status) {
	console.log('MQTT Connection Status: ' + status);
}

if (!window.plugins.mqttMessage) { 
	window.plugins.MQTTPlugin = new MQTTPlugin(); 
}