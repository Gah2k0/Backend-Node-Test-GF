import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { PrismaService } from '../prisma/prisma.service';
import { PokeApiService } from '../integrations/poke-api.service';
import { NotFoundException } from '@nestjs/common';

describe('src :: modules :: pokemons :: pokemons.service.ts', () => {
  let pokemonsService: PokemonsService,
    prismaServiceMock: any,
    pokeApiServiceMock: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      providers: [
        PokemonsService,
        {
          provide: PrismaService,
          useValue: {
            pokemon: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              delete: jest.fn(),
              update: jest.fn(),
              count: jest.fn(),
            },
            typesOnPokemons: {
              deleteMany: jest.fn(),
            },
          },
        },
        {
          provide: PokeApiService,
          useValue: {
            getPokemonData: jest.fn(),
          },
        },
      ],
    }).compile();

    pokemonsService = moduleFixture.get<PokemonsService>(PokemonsService);
    prismaServiceMock = moduleFixture.get<PrismaService>(PrismaService);
    pokeApiServiceMock = moduleFixture.get<PokeApiService>(PokeApiService);
  });

  describe('#getPokemons', () => {
    it('should call prisma with passed parameters, formatting name to a contains query', async () => {
      prismaServiceMock.pokemon.findMany.mockResolvedValueOnce([]);
      prismaServiceMock.pokemon.count.mockResolvedValueOnce(10);
      const prismaFindManyExpectedArgsWithNameContainsAndSort = {
        where: {
          types: { some: { type: { name: 'string' } } },
          name: { contains: 'string' },
        },
        take: 10,
        skip: (1 - 1) * 10,
        orderBy: { name: 'asc' },
        include: {
          types: {
            select: { type: true },
          },
        },
      };
      const getPokemonsQueryMock = {
        query: {
          type: 'string',
          name: 'string',
        },
        pagination: {
          page: 1,
          limit: 10,
        },
        sort: {
          sortBy: 'name',
          sortOrder: 'asc',
        },
      };

      const result = await pokemonsService.getPokemons(getPokemonsQueryMock);

      expect(result).toEqual({ data: [], total: 10 });
      expect(prismaServiceMock.pokemon.findMany).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.pokemon.findMany).toHaveBeenCalledWith(
        prismaFindManyExpectedArgsWithNameContainsAndSort,
      );
    });
    it('should call prisma with passed parameters without contain name', async () => {
      prismaServiceMock.pokemon.findMany.mockResolvedValueOnce([]);
      prismaServiceMock.pokemon.count.mockResolvedValueOnce(10);
      const prismaFindManyExpectedArgsWithoutNameContainsAndSort = {
        where: { types: { some: { type: { name: 'string' } } } },
        take: 10,
        skip: (1 - 1) * 10,
        orderBy: {},
        include: {
          types: {
            select: { type: true },
          },
        },
      };

      const getPokemonsQueryMock = {
        query: {
          type: 'string',
        },
        pagination: {
          page: 1,
          limit: 10,
        },
        sort: {},
      };

      const result = await pokemonsService.getPokemons(getPokemonsQueryMock);

      expect(result).toEqual({ data: [], total: 10 });
      expect(prismaServiceMock.pokemon.findMany).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.pokemon.findMany).toHaveBeenCalledWith(
        prismaFindManyExpectedArgsWithoutNameContainsAndSort,
      );
    });
  });
  describe('#createPokemon', () => {
    it('should call prisma create with passed parameters', async () => {
      prismaServiceMock.pokemon.create.mockResolvedValueOnce({});

      const mockCreatePokemonDto = {
        types: ['string'],
        name: 'string',
      };

      const expectedCreateArgs = {
        data: {
          name: 'string',
          types: {
            create: [
              {
                type: {
                  connectOrCreate: {
                    where: { name: 'STRING' },
                    create: { name: 'STRING' },
                  },
                },
              },
            ],
          },
        },
        include: {
          types: {
            select: { type: true },
          },
        },
      };

      const result = await pokemonsService.createPokemon(mockCreatePokemonDto);

      expect(result).toEqual({});
      expect(prismaServiceMock.pokemon.create).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.pokemon.create).toHaveBeenCalledWith(
        expectedCreateArgs,
      );
    });
  });
  describe('#deletePokemon', () => {
    it('should call prisma delete with passed parameters', async () => {
      prismaServiceMock.pokemon.delete.mockResolvedValueOnce({});

      const mockDeletePokemonDto = {
        id: 1,
      };

      const result = await pokemonsService.deletePokemon(mockDeletePokemonDto);

      expect(result).toBeUndefined();
      expect(prismaServiceMock.pokemon.delete).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.pokemon.delete).toHaveBeenCalledWith({
        where: mockDeletePokemonDto,
      });
    });
  });
  describe('#updatePokemon', () => {
    it('should call prisma update with passed parameters', async () => {
      prismaServiceMock.pokemon.update.mockResolvedValueOnce({});

      const mockupdatePokemonDto = {
        where: { id: 1 },
        data: { name: 'string', types: ['string'] },
      };

      const expectedUpdateArgs = {
        where: { id: 1 },
        data: {
          name: 'string',
          types: {
            create: [
              {
                type: {
                  connectOrCreate: {
                    where: { name: 'STRING' },
                    create: { name: 'STRING' },
                  },
                },
              },
            ],
          },
        },
        include: {
          types: {
            select: { type: true },
          },
        },
      };

      const result = await pokemonsService.updatePokemon(mockupdatePokemonDto);

      expect(result).toEqual({});
      expect(prismaServiceMock.pokemon.update).toHaveBeenCalledTimes(1);
      expect(prismaServiceMock.pokemon.update).toHaveBeenCalledWith(
        expectedUpdateArgs,
      );
    });
  });
  describe('#importPokemonFromPokeAPI', () => {
    it('should throw NotFoundException when poke api returns no data', async () => {
      pokeApiServiceMock.getPokemonData.mockResolvedValueOnce(null);

      expect(pokemonsService.importPokemonFromPokeAPI('123')).rejects.toThrow(
        new NotFoundException(`Pokemon with ID 123 not found in PokeAPI`),
      );
    });

    it('should call updatePokemon when pokemon already exists', async () => {
      const fetched = {
        name: 'pikachu',
        types: [{ type: { name: 'electric' } }],
      };

      pokemonsService['pokeApiService'].getPokemonData = jest
        .fn()
        .mockResolvedValueOnce(fetched);

      prismaServiceMock.pokemon.findUnique.mockResolvedValueOnce({ id: 123 });

      const updateSpy = jest
        .spyOn(pokemonsService as any, 'updatePokemon')
        .mockResolvedValueOnce({} as any);

      const result = await pokemonsService.importPokemonFromPokeAPI('123');

      expect(prismaServiceMock.pokemon.findUnique).toHaveBeenCalledWith({
        where: { id: 123 },
      });
      expect(updateSpy).toHaveBeenCalledWith({
        where: { id: 123 },
        data: { name: 'pikachu', types: ['ELECTRIC'] },
      });
      expect(result).toEqual({});
    });
  });
});
