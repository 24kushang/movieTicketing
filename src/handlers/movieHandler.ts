import { MovieService } from '../services/MovieService';
import { MovieRepository } from '../db/MovieRepository';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';

// Dependency injection: pass repository to service
const movieRepository = new MovieRepository();
const service = new MovieService(movieRepository);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Received event:', JSON.stringify(event, null, 2));
  const method = event.httpMethod;
  const id = event.pathParameters?.id;

  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const movie = { ...body, id: uuidv4() }; // Assuming Movie model has an id field
    console.log('Creating movie:', movie);
    const result = await service.createMovie(movie);
    return { statusCode: 201, body: JSON.stringify(result) };
  }

  if (method === 'GET') {
    if (id) {
      const movie = await service.getMovieById(id);
      if (!movie) return { statusCode: 404, body: 'Not found' };
      return { statusCode: 200, body: JSON.stringify(movie) };
    } else {
      const movies = await service.getAllMovies();
      return { statusCode: 200, body: JSON.stringify(movies) };
    }
  }

  if (method === 'DELETE' && id) {
    await service.deleteMovie(id);
    return { statusCode: 204, body: '' };
  }

  if( method === 'PUT' && id) {
    const body = JSON.parse(event.body || '{}');
    const updatedMovie = { ...body };
    const result = await service.updateMovie(id, updatedMovie);
    if (!result) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, body: JSON.stringify(result) };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
