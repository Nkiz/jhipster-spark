package <%=packageName%>.database;
import com.mongodb.MongoClient;
import com.mongodb.MongoClientOptions;
import com.mongodb.client.FindIterable;
import com.mongodb.client.model.Filters;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import com.mycompany.myapp.config.LocalConfig;

import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import spark.Request;
import spark.Response;
import spark.Route;
import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import org.bson.Document;
import org.bson.codecs.configuration.CodecRegistries;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.types.ObjectId;
import org.pac4j.sparkjava.SparkWebContext;
<%_ for (entity in entities) { _%>
import com.mycompany.myapp.domain.<%=entities[entity].entityName%>;
import com.mycompany.myapp.domain.<%=entities[entity].entityName%>ImpCodec;
<%_ } _%>

public class DatabaseService {
	//All Codecs
		<%_ for (entity in entities) { _%>
		static <%=entities[entity].entityName%>ImpCodec <%=entities[entity].entityName%>Codec = new <%=entities[entity].entityName%>ImpCodec();
		<%_ } _%>
		
		//Register Codecs
		<%_ for (entity in entities) { _%>
		static CodecRegistry codecRegistry = CodecRegistries.fromRegistries(MongoClient.getDefaultCodecRegistry(), CodecRegistries.fromCodecs(<%=entities[entity].entityName%>Codec));
		<%_ } _%>
		
		static MongoClientOptions options = MongoClientOptions.builder().codecRegistry(codecRegistry).build();
		static MongoClient client = new MongoClient(LocalConfig.Database.MONGODB_URL+":"+LocalConfig.Database.MONGODB_PORT, options); //connect to mongodb
		static MongoDatabase db = client.getDatabase(LocalConfig.Database.MONGODB_NAME);
		
		//Collections
		<%_ for (entity in entities) { _%>
		static MongoCollection<<%=entities[entity].entityName%>> collection<%=entities[entity].entityName%> = db.getCollection("<%=entities[entity].entityName%>", <%=entities[entity].entityName%>.class);
		
		//CRUD for Entity <%=entities[entity].entityName%>
		public static Route getAll<%=entities[entity].entityName%>s = (Request req, Response res) -> {
			FindIterable findIterable = collection<%=entities[entity].entityName%>.find();
		    Iterator iterator = findIterable.iterator();
		    List<Object> all<%=entities[entity].entityName%>s = new ArrayList<Object>();
		    JSONObject jsonObj = new JSONObject();
		    while(iterator.hasNext()){
		    	<%=entities[entity].entityName%> entity<%=entities[entity].entityName%> = (<%=entities[entity].entityName%>) iterator.next();
		        all<%=entities[entity].entityName%>s.add(entity<%=entities[entity].entityName%>.toString());
		    }
		    return all<%=entities[entity].entityName%>s.toString();
		};

		public static Route get<%=entities[entity].entityName%> = (Request req, Response res) -> {
			SparkWebContext context = new SparkWebContext(req, res);
			String[] pathNodes = context.getPath().split("/");
			<%=entities[entity].entityName%> entity<%=entities[entity].entityName%> = collection<%=entities[entity].entityName%>.find(Filters.eq("_id", new ObjectId(pathNodes[3]))).first();
		    if(entity<%=entities[entity].entityName%> != null) {
		    	return entity<%=entities[entity].entityName%>.toString();
		    }
			return "/";
		};
		
		public static Route update<%=entities[entity].entityName%> = (Request req, Response res) -> {
			SparkWebContext context = new SparkWebContext(req, res);
			String content = context.getRequestContent();
			JSONParser parser = new JSONParser();
			JSONObject json = (JSONObject) parser.parse(content);
			<%=entities[entity].entityName%> new<%=entities[entity].entityName%> = new <%=entities[entity].entityName%>(json);
		    collection<%=entities[entity].entityName%>.updateOne(Filters.eq("_id", new ObjectId(json.get("id").toString())), new Document("$set", new<%=entities[entity].entityName%>));
		    return content;
		};
		
		public static Route create<%=entities[entity].entityName%> = (Request req, Response res) -> {
			SparkWebContext context = new SparkWebContext(req, res);
			String content = context.getRequestContent();
			JSONParser parser = new JSONParser();
			JSONObject json = (JSONObject) parser.parse(content);
			<%=entities[entity].entityName%> entity<%=entities[entity].entityName%> = new <%=entities[entity].entityName%>(json);
			collection<%=entities[entity].entityName%>.insertOne(entity<%=entities[entity].entityName%>);
			
			return entity<%=entities[entity].entityName%>.toString();
		};
		
		public static Route delete<%=entities[entity].entityName%> = (Request req, Response res) -> {
			SparkWebContext context = new SparkWebContext(req, res);
			String content = context.getRequestContent();
			String[] pathNodes = context.getPath().split("/");
			collection<%=entities[entity].entityName%>.deleteOne(Filters.eq("_id",  new ObjectId(pathNodes[3])));
			return "";
		};
		<%_ } _%>
}
