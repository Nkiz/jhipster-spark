package <%=packageName%>.domain;

import org.bson.types.ObjectId;
import org.mongodb.morphia.annotations.Entity;
import org.mongodb.morphia.annotations.Id;

import net.minidev.json.JSONObject;

@Entity
public class <%=entity.entityName%> {
	@Id
	private ObjectId id;
	
	<%_ for (field in fields) { _%>
		<%_ if (fields[field].entityName === entity.entityName) { _%>
	private <%=fields[field].fieldType%> <%=fields[field].fieldName%>;
		<%_ } _%>
	<%_ } _%>
	
	public <%=entity.entityName%>(JSONObject json) {
		this.id = (ObjectId) json.get("_id");
		if (this.id == null) {
			this.id = new ObjectId();
		}
		<%_ for (field in fields) { _%>
			<%_ if (fields[field].entityName === entity.entityName) { _%>
				<%_ if (fields[field].fieldType === "String") { _%>
		this.<%=fields[field].fieldName%> = json.get("<%=fields[field].fieldName%>").toString();
				<%_ } _%>
				<%_ if (fields[field].fieldType === "int") { _%>
		this.<%=fields[field].fieldName%> = Integer.parseInt(json.get("<%=fields[field].fieldName%>").toString());
						<%_ } _%>
			<%_ } _%>
		<%_ } _%>
	}
	public <%=entity.entityName%>(ObjectId id 
			<%_ for (field in fields) { _%>
				<%_ if (fields[field].entityName === entity.entityName) { _%>
					   , <%=fields[field].fieldType%> <%=fields[field].fieldName%>
				<%_ } _%>
			<%_ } _%>
			) {
		this.id = id;
		<%_ for (field in fields) { _%>
			<%_ if (fields[field].entityName === entity.entityName) { _%>
		this.<%=fields[field].fieldName%> = <%=fields[field].fieldName%>;
			<%_ } _%>
		<%_ } _%>
	}
	
	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}
	<%_ for (field in fields) { _%>
		<%_ if (fields[field].entityName === entity.entityName) { _%>
	public <%=fields[field].fieldType%> geT<%=fields[field].fieldName%>(){
		return this.<%=fields[field].fieldName%>;
	}
	public void seT<%=fields[field].fieldName%>(<%=fields[field].fieldType%> <%=fields[field].fieldName%>){
		this.<%=fields[field].fieldName%> = <%=fields[field].fieldName%>;
	}
		<%_ } _%>
	<%_ } _%>
	
	@Override
    public String toString() {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("id" , getId().toString());
		<%_ for (field in fields) { _%>
			<%_ if (fields[field].entityName === entity.entityName) { _%>
		jsonObj.put("<%=fields[field].fieldName%>" , geT<%=fields[field].fieldName%>());
			<%_ } _%>
		<%_ } _%>
        return jsonObj.toString();
    }
}

