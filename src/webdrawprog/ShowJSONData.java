package webdrawprog;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import com.sun.jersey.api.view.Viewable;

/**
 * this class is for the redirection to the JSON data page
 * @author Mike
 *
 */
@Path("/showjsondata")
public class ShowJSONData {
	
	/**
	 * this method shows the current JSON data
	 * @return the viewable object with JSON data
	 */
	@GET
	@Path("getdata")
	public Viewable getData(){
		JSONData jsondata = new JSONData(JSONDataBean.getJSONData());
		return new Viewable("/html/jsondata.jsp",jsondata);
	}
}
