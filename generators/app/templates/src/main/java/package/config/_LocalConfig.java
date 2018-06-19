package <%=packageName%>.config;

public class LocalConfig {
	public static class Web {
		public static final int BASE_PORT = 8080;
		public static final String BASE_URL = "http://localhost" + ":" + BASE_PORT;
		public static final String BASE_URL_UI = "http://localhost:9000";
	}
	public static class Path {
        public static final String LOGIN = "/login";
		public static final String LOGIN_SUCCESS = "/success";
        public static final String LOGOUT = "/api/logout";
        public static final String ACCOUNT = "/api/account";
        public static final String PROFILE = "/api/profile-info";
    }
	public static class Database {
		public static final String MONGODB_URL = "localhost";
		public static final int MONGODB_PORT = 27017;
		public static final String MONGODB_NAME = "<%= mainClass %>";
	}
	public static class Auth {
		public static final String KC_URL			= "http://localhost:9080/auth"; //URL for Keycloak Server
		public static final String REALM 	 		= "jhipster"; // Realm
		public static final String TOKEN_URI 		= KC_URL + "/realms/" + REALM + "/protocol/openid-connect/token";
		public static final String AUTH_URI 		= KC_URL + "/realms/" + REALM + "/protocol/openid-connect/auth";
		public static final String DISCOVERY_URI 	= KC_URL + "/realms/" + REALM + "/.well-known/openid-configuration";
		public static final String LOGOUT_URI 		= KC_URL + "/realms/" + REALM + "/protocol/openid-connect/logout";
		public static final String ACCOUNT_INFO_URI 	= KC_URL + "/realms/" + REALM + "/account";
		public static final String CLIENT 			= "web_app"; //client_id
		public static final String SECRET 			= "web_app";
		public static final String RES_TYPE 		= "code";
		public static final String RES_MODE 		= "form_post";
		public static final String SCHEME 			= "form";
	    public static final String[] SCOPE 			= {"openid","profile", "email"};
	}
	public static class Profile {
		public static final String ACTIVE = "dev";
		public static final String INCLUDE = "swagger";
	}
}
