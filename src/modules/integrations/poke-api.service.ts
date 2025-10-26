import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PokeApiService {
  constructor() {}

  async getPokemonData(id: string): Promise<any> {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    try {
      const response = await fetch(url);
      Logger.log(`Fetched data from PokeAPI for Pokemon ID: ${id}`);
      return response.json();
    } catch (e) {
      throw new Error(`Failed to fetch data from PokeAPI: ${e.message}`);
    }
  }
}
