import { DynamoDBClient } from './DynamoDBClient';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Movie } from '../models/Movie';

export class MovieRepository {
  private tableName = 'movies';
  private db = DynamoDBClient.getInstance();

  async create(movie: Movie) {
    // Ensure the movie has an id before saving
    if (!movie.id) {
      throw new Error('Movie must have an id');
    }
    console.log("tableName", this.tableName);
    const command = new PutCommand({ TableName: this.tableName, Item: movie });
    await this.db.send(command)
    return movie;
  }

  async getById(id: string): Promise<Movie | undefined> {
    const res = await this.db.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return res.Item as Movie | undefined;
  }

  async getAll(): Promise<Movie[]> {
    const res = await this.db.send(new ScanCommand({ TableName: this.tableName }));
    return (res.Items as Movie[]) || [];
  }

  async update(id: string, updates: Partial<Movie>) {
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
    })
    await this.db.send(command);
    return this.getById(id);
  }

  async delete(id: string) {
    await this.db.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
