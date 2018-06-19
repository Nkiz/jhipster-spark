package <%=packageName%>.domain;

import org.bson.BsonReader;
import org.bson.BsonWriter;
import org.bson.Document;
import org.bson.codecs.Codec;
import org.bson.codecs.DecoderContext;
import org.bson.codecs.EncoderContext;
import org.bson.codecs.configuration.CodecRegistry;
import org.bson.types.ObjectId;

public class <%=entity.entityName%>ImpCodec implements Codec<<%=entity.entityName%>> {

    private Codec<Document> codecRegistry;

    public <%=entity.entityName%>ImpCodec() {
    }

    public Class<<%=entity.entityName%>> getEncoderClass() {
        return <%=entity.entityName%>.class;
    }

	@Override
	public void encode(BsonWriter writer, <%=entity.entityName%> doc, EncoderContext encoderContext) {
		writer.writeStartDocument();
//        writer.writeName("_id");
//        writer.writeObjectId(doc.getId());
        writer.writeName("_class");
        writer.writeString(doc.getClass().toString());
        <%_ for (field in fields) { _%>
			<%_ if (fields[field].entityName === entity.entityName) { _%>
		writer.writeName("<%=fields[field].fieldName%>");
				<%_ if (fields[field].fieldType === "String") { _%>
		writer.writeString(doc.geT<%=fields[field].fieldName%>());
				<%_ } _%>
				<%_ if (fields[field].fieldType === "int") { _%>
		writer.writeInt32(doc.geT<%=fields[field].fieldName%>());
				<%_ } _%>
				<%_ if (fields[field].fieldType === "long" || fields[field].fieldType === "float") { _%>
		writer.writeInt64(doc.geT<%=fields[field].fieldName%>());
				<%_ } _%>
				<%_ if (fields[field].fieldType === "double") { _%>
		writer.writeDouble(doc.geT<%=fields[field].fieldName%>());
				<%_ } _%>
			<%_ } _%>
		<%_ } _%>
        writer.writeEndDocument();
		
	}

	@Override
	public <%=entity.entityName%> decode(BsonReader reader, DecoderContext decoderContext) {
		// TODO Auto-generated method stub
		reader.readStartDocument();
        ObjectId _id = reader.readObjectId("_id");
        String _class = reader.readString("_class"); 
        
        <%_ for (field in fields) { _%>
			<%_ if (fields[field].entityName === entity.entityName) { _%>
				<%_ if (fields[field].fieldType === "String") { _%>
		<%=fields[field].fieldType%> <%=fields[field].fieldName%> = reader.readString("<%=fields[field].fieldName%>");
				<%_ } _%>
				<%_ if (fields[field].fieldType === "int") { _%>
		<%=fields[field].fieldType%> <%=fields[field].fieldName%> = reader.readInt32("<%=fields[field].fieldName%>");
				<%_ } _%>
				<%_ if (fields[field].fieldType === "long" || fields[field].fieldType === "float") { _%>
		<%=fields[field].fieldType%> <%=fields[field].fieldName%> = reader.readInt64("<%=fields[field].fieldName%>");
				<%_ } _%>
				<%_ if (fields[field].fieldType === "double") { _%>
				<%=fields[field].fieldType%> <%=fields[field].fieldName%> = reader.readDouble("<%=fields[field].fieldName%>");
				<%_ } _%>
			<%_ } _%>
		<%_ } _%>
        reader.readEndDocument();

        <%=entity.entityName%> doc = new <%=entity.entityName%>(_id 
				        		<%_ for (field in fields) { _%>
								<%_ if (fields[field].entityName === entity.entityName) { _%>
									, <%=fields[field].fieldName%>
								<%_ } _%>
							<%_ } _%>
							);
        return doc;
	}
}