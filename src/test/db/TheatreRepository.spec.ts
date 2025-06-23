import { DynamoDBClient } from '@db/DynamoDBClient';
import { TheatreRepository } from '@db/TheatreRepository';
import { Theatre } from '@models/Theatre';
import { v4 as uuidv4 } from 'uuid';

describe('TheatreRepository', () => {
    let repo: TheatreRepository;

    beforeAll(() => {
        const client = DynamoDBClient.getInstance();
        repo = new TheatreRepository();
    });

    it('should create a theatre', async () => {
        const theatre: Theatre = new Theatre(uuidv4(), 'Test Theatre', 'Test Location', 100);
        const created = await repo.create(theatre);
        expect(created).toBeDefined();
        expect(created.id).toBe(theatre.id);
        expect(created.name).toBe(theatre.name);
    });

    it('should get a theatre by ID', async () => {
        const theatre: Theatre = new Theatre(uuidv4(), 'Test Theatre2', 'Test Location2', 100);
        await repo.create(theatre);
        const found = await repo.getById(theatre.id);
        expect(found).toBeDefined();
        expect(found?.id).toBe(theatre.id);
    });

    it('should list all theatres', async () => {
        const theatres = await repo.getAll();
        expect(Array.isArray(theatres)).toBe(true);
    });

    it('should delete a theatre by ID', async () => {
        const theatre: Theatre = new Theatre(uuidv4(), 'Test Theatre', 'Test Location', 100);
        await repo.create(theatre);
        await repo.delete(theatre.id);
        const found = await repo.getById(theatre.id);
        expect(found).toBeUndefined();
    });
});