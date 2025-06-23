import { DynamoDBClient } from '@db/DynamoDBClient';

describe('DynamoDBClient', () => {
    let client: any;
    beforeAll(() => {
        client = DynamoDBClient.getInstance();
    });

    it('should return the same instance on multiple calls', () => {
        const anotherInstance = DynamoDBClient.getInstance();
        expect(client).toBe(anotherInstance);
    });

    it('should have a valid config', () => {
        expect(client).toBeDefined();
        expect(client.config).toBeDefined();
        expect(client.config.region).toBeDefined();
    });
});