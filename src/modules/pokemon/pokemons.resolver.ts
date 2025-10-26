import { Resolver, Query } from '@nestjs/graphql';
import { PokemonsService } from './pokemons.service';

@Resolver('Pokemon')
export class PokemonsResolver {
  constructor(private readonly pokemonService: PokemonsService) {}

  @Query('pokemon')
  pokemon() {
    return this.pokemonService.getPokemons({query: {}, pagination: { limit: 10, page: 1 }, sort: { sortBy: '1', sortOrder: '1'}});
  }
}
