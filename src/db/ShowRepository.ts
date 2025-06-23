import { DynamoDBClient } from "./DynamoDBClient";
import {
  PutCommand,
  GetCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Show } from "../models/Show";

export class ShowRepository {
  private tableName = "shows";
  private db = DynamoDBClient.getInstance();

  async create(show: Show) {
    await this.db.send(
      new PutCommand({ TableName: this.tableName, Item: show.toJSON() })
    );
    return show;
  }

  async getById(id: string): Promise<Show | undefined> {
    const res = await this.db.send(
      new GetCommand({ TableName: this.tableName, Key: { id } })
    );
    return res.Item ? Show.fromJSON(res.Item) : undefined;
  }

  async getAll(): Promise<Show[]> {
    const res = await this.db.send(
      new ScanCommand({ TableName: this.tableName })
    );
    return (res.Items || []).map(Show.fromJSON);
  }

  async getAllShowsForMovie(movieId: string): Promise<Show[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: "movieId = :movieId",
      ExpressionAttributeValues: {
        ":movieId": movieId,
      },
    });
    const res = await this.db.send(command);
    return (res.Items || []).map(Show.fromJSON);
  }

  async delete(id: string) {
    await this.db.send(
      new DeleteCommand({ TableName: this.tableName, Key: { id } })
    );
  }
}
