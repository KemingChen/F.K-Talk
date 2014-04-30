/**
 * 
 */
package com.Simple_App04;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

import edu.ntut.csie.mqtt.plugin.LogUtil;

import android.app.NotificationManager;
import android.app.Service;
import android.content.Context;
import android.net.ConnectivityManager;

/**
 * @author baytony
 *
 */
public class MQTTResources {
	
	public static final String TAG=MQTTResources.class.getName();
	private static ConnectivityManager aConnectionManager;
	private static NotificationManager mNotifMan;
	private static Simple_App04 mqtt;
	private static Service service;
	private static Context ctx;
	private static String today;
	
	static void init(Simple_App04 mqtt){
		MQTTResources.mqtt=mqtt;
		loadAll(mqtt);
	}
	
	static void init(Service service){
		MQTTResources.service=service;
		loadAll(service);
	}
	
	
	private static void loadAll(Context ctx){
		LogUtil.d(TAG, "Start MPortalResources with: ",ctx.getClass().getName());
		MQTTResources.ctx=ctx;
		MQTTResources.aConnectionManager=(ConnectivityManager) ctx.getSystemService(Context.CONNECTIVITY_SERVICE);
		MQTTResources.mNotifMan=(NotificationManager) ctx.getSystemService(Context.NOTIFICATION_SERVICE);
		SimpleDateFormat sf=new SimpleDateFormat("yyyyMMdd",Locale.TAIWAN);
		MQTTResources.today=sf.format(new Date());
	}
	
	public static ConnectivityManager getConnectivityManager(){
		return aConnectionManager;
	}
	
	public static NotificationManager getNotificationManager(){
		return mNotifMan;
	}
	
	public static String getToday(){
		return today;
	}
	
	public static boolean isService(){
		if(service==null){
			return false;
		}
		return true;
	}
	
	public static Simple_App04 getMQTT(){
		if(mqtt==null){
			throw new RuntimeException("DemoMQTTResources不是由DemoMQTT的畫面程式啓動，無法提供getDemoMQTT()的執行功能！");
		}
		return mqtt;
	}
	
	public static Service getSerivce(){
		if(service==null){
			throw new RuntimeException("DemoMQTTResources不是由Service的程式啓動，無法提供getDemoMQTT()的執行功能！");
		}
		return service;
	}
	
	public static Context getContext(){
		return ctx.getApplicationContext();
	}
	
	
}
