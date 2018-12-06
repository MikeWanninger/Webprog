package webdrawprog;

import org.codehaus.jettison.json.JSONObject;

/**
 * this class is holding the JSON data which will send to the jsp
 * @author Mike
 *
 */
public class JSONData {
	private String data = "{}";
	private JSONObject object = null;
	
	/**
	 * set the incoming json string
	 * @param data json data string
	 */
	public JSONData(String data){
		this.data = data;
	}
	
	/**
	 * set the coming json string and object
	 * @param jsonData json string
	 * @param obj json object
	 */
	public JSONData(String jsonData, JSONObject obj) {
		this.data = data;
		object = obj;
	}
	
	/**
	 * 
	 * @return returns the current json string
	 */
	public String getData() {
		return data;
	}
	
	/**
	 * 
	 * @return returns the current json object
	 */
	public JSONObject getObject(){
		return object;
	}
}
