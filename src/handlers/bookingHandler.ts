import { BookingService } from '../services/BookingService';
import { BookingRepository } from '../db/BookingRepository';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { Booking, BookingStatus } from '../models/Booking';
import { ShowRepository } from '@db/ShowRepository';

const bookingRepository = new BookingRepository();
const showRepository = new ShowRepository();
const bookingService = new BookingService(bookingRepository, showRepository);

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const method = event.httpMethod;
  const id = event.pathParameters?.id;

  // switch case
  if (method === 'POST') {
    const body = JSON.parse(event.body || '{}');
    const booking: Booking = { ...body, id: uuidv4(), status: BookingStatus.CONFIRMED };
    const result = await bookingService.createBooking(booking);
    return { statusCode: 201, body: JSON.stringify(result) };
  }

  if (method === 'GET' && id) {
    const booking = await bookingService.getBooking(id);
    if (!booking) return { statusCode: 404, body: 'Not found' };
    return { statusCode: 200, body: JSON.stringify(booking) };
  }

  if (method === 'DELETE' && id) {
    // Not implemented yet
    return { statusCode: 501, body: 'Not implemented' };
  }

  return { statusCode: 405, body: 'Method Not Allowed' };
};
