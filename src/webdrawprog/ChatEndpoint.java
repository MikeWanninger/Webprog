package webdrawprog;
import java.io.IOException;
import java.io.StringWriter;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.Iterator;
import java.util.Set;

import javax.json.Json;
import javax.json.JsonObject;
import javax.json.JsonWriter;
import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

import jdk.nashorn.internal.ir.debug.JSONWriter;

import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;

import com.sun.jersey.spi.resource.Singleton;
import com.sun.scenario.effect.impl.sw.java.JSWInvertMaskPeer;

/**
 * Serverendpoint for the chat
 * @author Mike
 *
 */
@Singleton
@ServerEndpoint("/chat")
public class ChatEndpoint {
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
	 * get data from incoming data of the websocket.
	 * on the first incoming message it stores the name of the user into the session.
	 * if the username is already set it sends the message from the user to all other user inside the user list
	 * @param message incoming message
	 * @param uSession current session
	 * @throws JSONException
	 * @throws IOException
	 */
	@OnMessage
	public void receive(String message, Session uSession) throws JSONException, IOException{
		String username = (String) uSession.getUserProperties().get("username");
		if(username == null){
			uSession.getUserProperties().put("username", message);
			uSession.getBasicRemote().sendText("System: you are now connected as " + message);
		}else{
			Iterator<Session> iter = userlist.iterator();
			while(iter.hasNext())
				iter.next().getBasicRemote().sendText(username+": "+ message);
		}
	}
}
