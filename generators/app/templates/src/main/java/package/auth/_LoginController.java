package <%=packageName%>.auth;

import net.minidev.json.JSONObject;
import spark.Request;
import spark.Response;
import spark.Route;
import <%=packageName%>.config.LocalConfig;

import java.util.Optional;

import org.pac4j.core.profile.ProfileManager;
import org.pac4j.core.redirect.RedirectAction;
import org.pac4j.sparkjava.SparkWebContext;
import org.pac4j.oidc.config.KeycloakOidcConfiguration;
import org.pac4j.oidc.logout.OidcLogoutActionBuilder;
import org.pac4j.oidc.profile.keycloak.KeycloakOidcProfile;

public class LoginController {
	
	public static final String SAVED_LOGIN_ORIGIN_URI = LoginController.class.getName() + "_SAVED_ORIGIN";
	public static KeycloakOidcConfiguration kcConfig;
	public static KeycloakOidcProfile  user = null;
	
	public static Route getAccount = (Request req, Response res) -> {
		SparkWebContext context = new SparkWebContext(req, res);
		ProfileManager manager = new ProfileManager(context);
		user = new KeycloakOidcProfile ();
		user.clearSensitiveData();
		if(manager != null) {
			Optional<KeycloakOidcProfile> profile = manager.get(true);
			user = profile.get();
			
			JSONObject jsonObj = new JSONObject();
			jsonObj.clear();
			jsonObj.put("id", 				user.getId());
			jsonObj.put("login", 			user.getUsername());
			jsonObj.put("firstName", 		user.getFirstName());
			jsonObj.put("lastName", 		user.getFamilyName());
			jsonObj.put("email", 			user.getEmail());
			jsonObj.put("imageUrl", 		user.getPictureUrl());
			jsonObj.put("activated", 		true);
			jsonObj.put("langKey", 			null);
			jsonObj.put("createdBy", 		null);
			jsonObj.put("createdDate", 		user.getAcr());
			jsonObj.put("lastModifiedBy", 	null);
			jsonObj.put("lastModifiedDate", user.getUpdatedAt());
			jsonObj.put("authorities", 		user.getAttribute("roles"));
			
			return jsonObj.toJSONString();
		}
		return "/";
	};
	
	//login
	public static Route login = (Request req, Response res) -> {
		res.redirect(LocalConfig.Web.BASE_URL_UI);
		return "/";
	};
	
	//logout
	public static Route logout = (Request req, Response res) -> {
		OidcLogoutActionBuilder<KeycloakOidcProfile> logoutBuilder = new OidcLogoutActionBuilder<KeycloakOidcProfile>(kcConfig);
		SparkWebContext context = new SparkWebContext(req, res);
		logoutBuilder.init(context);
		RedirectAction redirAction = logoutBuilder.getLogoutAction(context, user, LocalConfig.Web.BASE_URL_UI);
//		res.redirect(redirAction.getLocation());
		redirAction.perform(context);
		context.getSessionStore().destroySession(context);
		user = null;
//		res.redirect(LocalConfig.Auth.LOGOUT_URI);
		return "/";
	};
	
	public static Route logout2 = (Request req, Response res) -> {
		res.redirect(LocalConfig.Auth.LOGOUT_URI);
		return "/";
	};
	//ProfileInfo from Config
	public static Route getProfileInfo = (Request req, Response res) -> {
		JSONObject json = new JSONObject();
		String[] profiles = {LocalConfig.Profile.INCLUDE, LocalConfig.Profile.ACTIVE};
		json.put("activeProfiles", profiles);
		json.put("ribbonEnv", LocalConfig.Profile.ACTIVE);
		return json.toString();
	};
	
	public static void setConfig(KeycloakOidcConfiguration configuration) {
		kcConfig = configuration;
	};
	
	public static KeycloakOidcConfiguration getConfig() {
		return kcConfig;
	};
}
