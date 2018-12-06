package webdrawprog;

import javax.ws.rs.GET;
import javax.ws.rs.Path;

import com.sun.jersey.api.view.Viewable;

/**
 * this class is for redirection to the index.jsp as startpoint
 * @author Mike
 *
 */
@Path("/chat")
public class Link {
	 /**
	  * 
	  * @return returns the viewable object to the main page
	  */
	@GET
	@Path("/home")
	public Viewable test(){
		return new Viewable("/html/index.jsp");
	}
}
