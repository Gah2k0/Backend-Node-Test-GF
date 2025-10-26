import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';
import { PrismaService } from '../prisma/prisma.service';
import seed from '../../../prisma/seed';

describe('"pokemon" module tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.$connect();
    await prisma.typesOnPokemons.deleteMany();
    await prisma.pokemon.deleteMany();
    await prisma.type.deleteMany();
    await seed();
    await app.init();
  });

  afterAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    const prisma = moduleFixture.get<PrismaService>(PrismaService);
    await prisma.$connect();  
    await prisma.typesOnPokemons.deleteMany();
    await prisma.pokemon.deleteMany();
    await prisma.type.deleteMany();
    await seed();
  });

  const createPokemon = async (data) => {
    return await request(app.getHttpServer()).post('/pokemons').send(data);
  };

  it('should return pokemons', async () => {
    const response: any = await request(app.getHttpServer())
      .get('/pokemons?limit=10')
      .send({})
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.length).toBe(10);
  });
  it('should create a pokemon', async () => {
    const response: any = await request(app.getHttpServer())
      .post('/pokemons')
      .send({ name: 'Gabriel', types: ['backend developer'] })
      .expect(201);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.name).toBe('Gabriel');
    expect(response.body.types[0].type.name).toBe('BACKEND DEVELOPER');
    expect(response.body.id).toBeGreaterThan(0);
  });
  it('should delete a pokemon', async () => {
    const createdPokemon = await createPokemon({
      name: 'Gabriel',
      types: ['backend developer'],
    });
    const response: any = await request(app.getHttpServer())
      .delete(`/pokemons/${createdPokemon.body.id}`)
      .send()
      .expect(204);

    expect(response.body.errors).toBeUndefined();
    expect(response.body).toStrictEqual({});
  });
  it('should update a pokemon', async () => {
    const createdPokemon = await createPokemon({
      name: 'Gabriel',
      types: ['backend developer'],
    });
    const response: any = await request(app.getHttpServer())
      .put(`/pokemons/${createdPokemon.body.id}`)
      .send({
        types: ['new type'],
        name: createdPokemon.body.name,
      })
      .expect(200);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.types[0].type.name).toBe('NEW TYPE');
    expect(response.body.id).toEqual(createdPokemon.body.id);
    expect(response.body.name).toEqual(createdPokemon.body.name);
  });
});
