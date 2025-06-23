import { DynamoDBClient } from './DynamoDBClient';
import { PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { Theatre } from '../models/Theatre';

export class TheatreRepository {
  private tableName = 'theatres';
  private db = DynamoDBClient.getInstance();

  async create(theatre: Theatre) {
    await this.db.send(new PutCommand({ TableName: this.tableName, Item: theatre }));
    return theatre;
  }

  async getById(id: string): Promise<Theatre | undefined> {
    const res = await this.db.send(new GetCommand({ TableName: this.tableName, Key: { id } }));
    return res.Item as Theatre | undefined;
  }

  async getAll(): Promise<Theatre[]> {
    const res = await this.db.send(new ScanCommand({ TableName: this.tableName }));
    return (res.Items as Theatre[]) || [];
  }

  async update(id: string, updates: Partial<Theatre>) {
    // Implement update logic as needed
  }

  async delete(id: string) {
    await this.db.send(new DeleteCommand({ TableName: this.tableName, Key: { id } }));
  }
}
