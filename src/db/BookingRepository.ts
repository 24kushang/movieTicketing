import { DynamoDBClient } from './DynamoDBClient';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Booking } from '../models/Booking';

export class BookingRepository {
  private tableName = 'bookings';
  private db = DynamoDBClient.getInstance();

  async create(booking: Booking) {
    await this.db.send(new PutCommand({ TableName: this.tableName, Item: booking }));
    return booking;
  }

  //variable naming
  async getById(id: string): Promise<Booking | undefined> {
    const res = await this.db.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return res.Item as Booking | undefined;
  }

  async getAll(): Promise<Booking[]> {
    const res = await this.db.send(new ScanCommand({ TableName: this.tableName }));
    return (res.Items as Booking[]) || [];
  }

  async update(id: string, updates: Partial<Booking>) {
    // Implement update logic as needed
    const updateExpression = Object.keys(updates)
      .map((key, index) => `${key} = :val${index}`)
      .join(', ');
    const expressionAttributeValues = Object.fromEntries(
      Object.entries(updates).map((entry, index) => [`:val${index}`, entry[1]])
    );
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression}`,
      ExpressionAttributeValues: expressionAttributeValues,
    });
    const response = await this.db.send(command);
    return response.Attributes as Booking | undefined;
  }

  async delete(id: string) {
    await this.db.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
