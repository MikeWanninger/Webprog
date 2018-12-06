package webdrawprog;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import org.codehaus.jettison.json.JSONObject;

import com.sun.jersey.api.view.Viewable;

/**
 * this class is for the redirect to the image page and reset the current JSON data
 * @author Mike
 *
 */
@Path("/showimage")
public class ShowImage {
	/**
	 * this method is sending the user to the current image
	 * @return viewable object which contains the JSON data
	 */
	@GET
	@Path("/get")
	public Viewable showImage(){
		JSONData jsondata = new JSONData(JSONDataBean.getJSONData(), JSONDataBean.getJSONObject());
		return new Viewable("/html/image.jsp", jsondata);
	}
	
	/**
	 * this method resets the current JSON data in the JSONDataBeans
	 * @return returns the viewable object with the cleared JSON data
	 */
	@GET
	@Path("/reset")
	public Viewable resetImage(){
		JSONDataBean.setJSONData(new JSONObject());
		JSONData jsondata = new JSONData(JSONDataBean.getJSONData(), JSONDataBean.getJSONObject());
		return new Viewable("/html/image.jsp",jsondata);
	}
}
