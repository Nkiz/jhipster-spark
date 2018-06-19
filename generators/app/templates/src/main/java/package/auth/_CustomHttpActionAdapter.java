package <%=packageName%>.auth;

import org.pac4j.core.context.HttpConstants;
import org.pac4j.sparkjava.DefaultHttpActionAdapter;
import org.pac4j.sparkjava.SparkWebContext;
import spark.ModelAndView;
import spark.TemplateEngine;

import java.util.HashMap;

import static spark.Spark.*;

public class CustomHttpActionAdapter extends DefaultHttpActionAdapter {

    private final TemplateEngine templateEngine;

    public CustomHttpActionAdapter(final TemplateEngine templateEngine) {
        this.templateEngine = templateEngine;
    }

    @Override
    public Object adapt(int code, SparkWebContext context) {
        if (code == HttpConstants.UNAUTHORIZED) {
            stop(401, templateEngine.render(new ModelAndView(new HashMap<>(), "error401.mustache")));
        } else if (code == HttpConstants.FORBIDDEN) {
            stop(403, templateEngine.render(new ModelAndView(new HashMap<>(), "error403.mustache")));
        } else {
            return super.adapt(code, context);
        }
        return null;
    }
}
