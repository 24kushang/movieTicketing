import { ShowService } from "../services/ShowService";
import { ShowRepository } from "../db/ShowRepository";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuidv4 } from "uuid";
import { Show } from "../models/Show";
import { Seat } from "../models/Seat";

const showRepository = new ShowRepository();
const service = new ShowService(showRepository);

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const id = event.pathParameters?.id || "";
  const resource = event.resource;

  if (method === "POST") {
    const body = JSON.parse(event.body || "{}");
    if (!body.movieId) {
      return { statusCode: 400, body: "Movie ID is required" };
    }
    // Delegate seat logic to service
    const showData = {
      id: uuidv4(),
      movieId: body.movieId,
      theatreId: body.theatreId,
      time: body.time,
      price: body.price,
      seats: body.seats,
    };
    const result = await service.createShow(showData);
    return { statusCode: 201, body: JSON.stringify(result.toJSON()) };
  }

  if (method === "GET") {
    if (resource === "/shows/movies/{id}") {
      const shows = await service.listShows(id);
      return {
        statusCode: 200,
        body: JSON.stringify(shows.map((show) => show.toJSON())),
      };
    } else if (id) {
      const show = await service.getShow(id);
      if (!show) return { statusCode: 404, body: "Not found" };
      return { statusCode: 200, body: JSON.stringify(show.toJSON()) };
    }
    const shows = await service.listShows("");
    return {
      statusCode: 200,
      body: JSON.stringify(shows.map((show) => show.toJSON())),
    };
  }

  if (method === "DELETE" && id) {
    await service.deleteShow(id);
    return { statusCode: 204, body: "" };
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};
