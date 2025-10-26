import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../app.module';

describe('"pokemon" module tests', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  const createPokemon = async (data) => {
    return await request(app.getHttpServer())
          .post('/pokemons')
          .send(data);
  }

  // it('should return "Pokemon World!"', async () => {
  //   const response: any = await request(app.getHttpServer())
  //     .post('/graphql')
  //     .send({
  //       query: `query pokemons {
	// 				pokemons
	// 			}`,
  //     });

  //   expect(response.body.errors).toBeUndefined();
  //   expect(response.body.data.pokemon).toBe('Pokemon World!');
  // });
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
      .send({ name: 'Gabriel', type: 'backend developer'})
      .expect(201);

    expect(response.body.errors).toBeUndefined();
    expect(response.body.name).toBe('Gabriel');
    expect(response.body.type).toBe('backend developer');
    expect(response.body.id).toBeGreaterThan(0);
  });
  it('should delete a pokemon', async () => {
    const createdPokemon = await createPokemon({ name: 'Gabriel', type: 'backend developer'});
    const response: any = await request(app.getHttpServer())
      .delete(`/pokemons/${createdPokemon.body.id}`)
      .send()
      .expect(204);
      

    expect(response.body.errors).toBeUndefined();
    expect(response.body).toStrictEqual({});
  });
  it('should update a pokemon', async () => {
    const createdPokemon = await createPokemon({ name: 'Gabriel', type: 'backend developer'});
    const response: any = await request(app.getHttpServer())
      .put(`/pokemons/${createdPokemon.body.id}`)
      .send({
        'type': 'new type'
      })
      .expect(200);
      

    expect(response.body.errors).toBeUndefined();
    expect(response.body.type).toBe('new type');
    expect(response.body.id).toEqual(createdPokemon.body.id);
    expect(response.body.name).toEqual(createdPokemon.body.name);
  });
});
