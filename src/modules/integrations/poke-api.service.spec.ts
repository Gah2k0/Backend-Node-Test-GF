import { Test, TestingModule } from '@nestjs/testing';
import { PokeApiService } from './poke-api.service';
import { Logger } from '@nestjs/common';

describe('src :: modules :: integrations :: poke-api.service.ts', () => {
  let service: PokeApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeApiService],
    }).compile();

    service = module.get<PokeApiService>(PokeApiService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    try {
      delete (global as any).fetch;
    } catch (e) {}
  });

  it('should fetch pokemon data and return parsed json, and log the fetch', async () => {
    const mockJson = { id: '1', name: 'bulbasaur' };
    const mockResponse = {
      json: jest.fn().mockResolvedValueOnce(mockJson),
    } as any;
    const fetchMock = jest.fn().mockResolvedValueOnce(mockResponse);
    (global as any).fetch = fetchMock;

    const loggerSpy = jest.spyOn(Logger, 'log').mockImplementation(() => {});

    const result = await service.getPokemonData('1');

    expect(result).toEqual(mockJson);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/1',
    );
    expect(loggerSpy).toHaveBeenCalledWith(
      'Fetched data from PokeAPI for Pokemon ID: 1',
    );
  });

  it('should throw an error when fetch fails', async () => {
    const fetchMock = jest
      .fn()
      .mockRejectedValueOnce(new Error('network failure'));
    (global as any).fetch = fetchMock;

    await expect(service.getPokemonData('2')).rejects.toThrow(
      /Failed to fetch data from PokeAPI: network failure/,
    );

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/2',
    );
  });
});
