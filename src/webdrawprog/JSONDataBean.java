package webdrawprog;

import org.codehaus.jettison.json.JSONObject;

import com.sun.jersey.spi.resource.Singleton;

/**
 * this class is holding the JSON data and the actual counter
 * @author Mike
 *
 */
public class JSONDataBean {
	
	/**
	 * holding the JSON data object
	 */
	public static JSONObject JSONData = new JSONObject();
	
	/**
	 * counter of the JSON data entries
	 */
	public static int counter = 0;
	
	/**
	 * 
	 * @return returns the counter and increment it afterwards
	 */
	public static synchronized int incrementAndGetCounter(){
		return counter++;
	}
	
	/**
	 * set the new JSON object
	 * @param data JSON object
	 */
	public static void setJSONData(JSONObject data){
		JSONData = data;
	}
	
	/**
	 * 
	 * @return return the JSON data as string
	 */
	public static String getJSONData(){
		return JSONData.toString();
	}
	
	/**
	 * 
	 * @return returns the JSON data as object
	 */
	public static JSONObject getJSONObject(){
		return JSONData;
	}
}
