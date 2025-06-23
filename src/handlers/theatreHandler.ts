import { TheatreService } from "../services/TheatreService";
import { TheatreRepository } from "../db/TheatreRepository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Theatre } from "../models/Theatre";

const theatreRepository = new TheatreRepository();
const service = new TheatreService(theatreRepository);

// combining the functionality of creating, listing, and deleting theatres in one handler file
export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log("Received event:", JSON.stringify(event, null, 2));

  const method = event.httpMethod;
  const id = event.pathParameters?.id;
  console.log(`Method: ${method}, ID: ${id}`);

  if (method === "POST") {
    const body = JSON.parse(event.body || "{}");
    const theatre: Theatre = { ...body, id: uuidv4() }; // Assuming Theatre model has an id field
    console.log("Creating theatre:", theatre);

    const response = await service.createTheatre(theatre); // Assuming createTheatre is implemented in TheatreService
    return { statusCode: 201, body: JSON.stringify(response) };
  } else if (method === "GET") {
    if (id) {
      const theatre = await service.getTheatre(id);

      if (!theatre) return { statusCode: 404, body: "Not found" };

      return { statusCode: 200, body: JSON.stringify(theatre) };
    } else {
      const theatres = await service.listTheatres();

      return { statusCode: 200, body: JSON.stringify(theatres) };
    }
  } else if (method === "DELETE" && id) {
    const deletedRecord = service.deleteTheatre(id);

    const response: APIGatewayProxyResult = {
      statusCode: 201,
      body: JSON.stringify(deletedRecord),
    };

    return response;
  } else if (method === "PUT" && id) {
    const body = JSON.parse(event.body || "{}");
    const updatedTheatre = { ...body };

    const result = await service.updateTheatre(id, updatedTheatre); // Assuming updateTheatre is implemented in TheatreService

    if (!result) return { statusCode: 404, body: "Not found" };

    return { statusCode: 200, body: JSON.stringify(result) };
  }
  return { statusCode: 405, body: "Method Not Allowed" };
};
