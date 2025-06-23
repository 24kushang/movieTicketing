import { DynamoDBClient as AWSClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoDBClient {
  private static instance: DynamoDBDocumentClient;

  private constructor() {}

  public static getInstance(): DynamoDBDocumentClient {
    if (!DynamoDBClient.instance) {
      const client = new AWSClient({
        region: process.env.AWS_REGION || 'us-east-1',
        endpoint: process.env.AWS_ENDPOINT_URL || 'http://localhost:4566',
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'test',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'test',
        },
      });
      DynamoDBClient.instance = DynamoDBDocumentClient.from(client);
    }
    return DynamoDBClient.instance;
  }
}
