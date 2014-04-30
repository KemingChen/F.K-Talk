/**
 * 
 */
package com.mqtt.plugin;

import org.apache.cordova.api.CallbackContext;
import org.apache.cordova.api.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import com.FKTalk.MQTTResources;
import com.FKTalk.FKTalk;

import edu.ntut.csie.mqtt.plugin.LogUtil;


/**
 * @author tonyyang
 *
 */
public class MQTTPlugin extends CordovaPlugin {
	
	public static final String TAG=MQTTPlugin.class.getCanonicalName();
	private static final String CONNECT = "CONNECT";
	private static final String SEND_MSG = "SEND_MSG";
	private static final int DEFAULT_QOS = 2;

	@Override
	public boolean execute(String action, JSONArray arguments, CallbackContext callbackContext) throws JSONException {
		FKTalk app=MQTTResources.getMQTT();
		if(CONNECT.equals(action)) {
			String clientId = arguments.getString(0);
			String topic = arguments.getString(1);
			app.subscribeTopic(clientId, topic);
			callbackContext.success();
			return true;
		}else if(SEND_MSG.equals(action)){
			// 這邊的 TOPIC 不會經過特別處理
			String topic = arguments.getString(0);
			String message = arguments.getString(1);
			app.publishMessage(topic, message, DEFAULT_QOS);
			callbackContext.success();
			return true;	
		}
		String error="UNKNOW action:"+action+" for MQPlugin.";
		callbackContext.error(error);
		LogUtil.w(TAG, error);
		return false;
	}

}
