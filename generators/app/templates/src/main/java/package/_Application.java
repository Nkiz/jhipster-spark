package <%=packageName%>;

import static spark.Spark.*;


import org.apache.log4j.BasicConfigurator;
import org.pac4j.core.config.Config;
import org.pac4j.sparkjava.CallbackRoute;
import org.pac4j.sparkjava.SecurityFilter;

import <%=packageName%>.database.DatabaseService;
import <%=packageName%>.auth.CustomConfigFactory;
import <%=packageName%>.auth.LoginController;
import spark.template.mustache.MustacheTemplateEngine;
import <%=packageName%>.config.LocalConfig;
public class <%= mainClass %> {
	
	private final static String JWT_SALT = "12345678901234567890123456789012";
	private final static MustacheTemplateEngine JWT_TEMPLATE = new MustacheTemplateEngine();

	public static DatabaseService databaseService = new DatabaseService();

	public static void main(String[] args) {
		BasicConfigurator.configure();
		port(LocalConfig.Web.BASE_PORT);
		
		final Config config = new CustomConfigFactory(JWT_SALT, JWT_TEMPLATE).build();
		final CallbackRoute callback = new CallbackRoute(config, null, true);
		before(LocalConfig.Path.LOGIN, new SecurityFilter(config, "KeycloakOidcClient"));
		// Login Page
		get(LocalConfig.Path.LOGIN_SUCCESS, callback);
		post(LocalConfig.Path.LOGIN_SUCCESS, callback);
		//login
		get(LocalConfig.Path.LOGIN, LoginController.login);
		//logout
		get(LocalConfig.Path.LOGOUT, LoginController.logout);
		post(LocalConfig.Path.LOGOUT, LoginController.logout2);
		//Get account information
		get(LocalConfig.Path.ACCOUNT, LoginController.getAccount);
		//Profile-Info
		get(LocalConfig.Path.PROFILE, LoginController.getProfileInfo);
		
		//entity CRUD
		<%_ for (entity in entities) { _%>
		get("/api/<%=entities[entity].entityLc%>s/*", DatabaseService.get<%=entities[entity].entityName%>);
		get("/api/<%=entities[entity].entityLc%>s", DatabaseService.getAll<%=entities[entity].entityName%>s);
		put("/api/<%=entities[entity].entityLc%>s", DatabaseService.update<%=entities[entity].entityName%>);
		post("/api/<%=entities[entity].entityLc%>s", DatabaseService.create<%=entities[entity].entityName%>);
		delete("/api/<%=entities[entity].entityLc%>s/*", DatabaseService.delete<%=entities[entity].entityName%>);
		<%_ } _%>
		//db coffee
//		get("/api/coffees/*", DatabaseService.getCoffee);
//		get("/api/coffees", DatabaseService.getAllCoffees);
//		put("/api/coffees", DatabaseService.updateCoffee);
//		post("/api/coffees", DatabaseService.createCoffee);
//		delete("/api/coffees/*", DatabaseService.deleteCoffee);
	}
}
