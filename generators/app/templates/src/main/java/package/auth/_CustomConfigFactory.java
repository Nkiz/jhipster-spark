package <%=packageName%>.auth;

import org.pac4j.core.client.Clients;
import org.pac4j.core.config.*;
import org.pac4j.oidc.client.KeycloakOidcClient;
import org.pac4j.oidc.config.KeycloakOidcConfiguration;
import org.pac4j.oidc.config.OidcConfiguration;

import com.nimbusds.oauth2.sdk.auth.ClientAuthenticationMethod;
import org.apache.commons.lang3.StringUtils;

import <%=packageName%>.auth.LoginController;
import spark.TemplateEngine;
import <%=packageName%>.config.LocalConfig;

public class CustomConfigFactory implements ConfigFactory {

	private final String salt;
    private final TemplateEngine templateEngine;

    public CustomConfigFactory(final String salt, final TemplateEngine templateEngine) {
        this.salt = salt;
        this.templateEngine = templateEngine;
    }

    @Override
    public Config build(final Object... parameters) {
    	final KeycloakOidcConfiguration configuration = new KeycloakOidcConfiguration();
    	//final OidcConfiguration configuration = new OidcConfiguration();
    	configuration.setClientId(LocalConfig.Auth.CLIENT);
    	configuration.setSecret(LocalConfig.Auth.CLIENT);
    	configuration.setRealm(LocalConfig.Auth.REALM);
    	configuration.setBaseUri(LocalConfig.Auth.KC_URL);
    	//configuration.setDiscoveryURI(LocalConfig.Auth.DISCOVERY_URI);
    	configuration.setScope(StringUtils.join(LocalConfig.Auth.SCOPE, " "));
    	configuration.setResponseType(LocalConfig.Auth.RES_TYPE);
    	configuration.setResponseMode(LocalConfig.Auth.RES_MODE);
    	configuration.setCallbackUrl(LocalConfig.Web.BASE_URL_UI);
    	configuration.setClientAuthenticationMethod(ClientAuthenticationMethod.CLIENT_SECRET_BASIC);
    	configuration.setLogoutUrl(LocalConfig.Auth.LOGOUT_URI);
    	LoginController.setConfig(configuration);
    	final KeycloakOidcClient keycloakClient = new KeycloakOidcClient(configuration);
    	
        final Clients clients = new Clients(LocalConfig.Web.BASE_URL + LocalConfig.Path.LOGIN_SUCCESS, keycloakClient);

        final Config config = new Config(clients);
        config.setHttpActionAdapter(new CustomHttpActionAdapter(templateEngine));
        return config;
    }
}
