package webdrawprog;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;



import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.sun.corba.se.impl.ior.ByteBuffer;
import com.sun.jersey.spi.resource.Singleton;

/**
 * Serverendpoint for the canvas
 * @author Mike
 *
 */
@Singleton
@ServerEndpoint("/draw/{type}")
public class DrawEndpoint {
	/**
	 * stores the list of users which are connected
	 */
	static Set<Session> userlist = Collections.synchronizedSet(new HashSet<Session>());
	
	/**
	 * put the user who connect to the server into the user list
	 * @param uSession current session of the user who's connecting
	 */
	@OnOpen
	public void open(Session uSession){
		userlist.add(uSession);
	}
	
	/**
	 * remove the user who disconnect from the server from the user list
	 * @param uSession
	 */
	@OnClose
	public void close(Session uSession){
		userlist.remove(uSession);
	}
	
	/**
	 * set the incoming data into the JSONDataBean for the image preview and
	 * send the data to the other user
	 * @param data incoming json string with shape attributes
	 * @param uSession current session
	 * @param type type of connection
	 * @throws JSONException
	 * @throws IOException
	 * @throws EncodeException
	 */
	@OnMessage
	public void receive(String data, Session uSession, @PathParam("type") String type) throws JSONException, IOException, EncodeException{
		
		String str = JSONDataBean.getJSONData();
		JSONObject obj = new JSONObject(str);
		JSONObject obj2 = new JSONObject(data);
		obj.put(""+JSONDataBean.incrementAndGetCounter(), obj2);
		JSONDataBean.setJSONData(obj);
		Iterator<Session> iter = userlist.iterator();
		while(iter.hasNext())
			iter.next().getBasicRemote().sendText(data);
	}
}
