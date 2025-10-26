import { Resolver, Query } from '@nestjs/graphql';
import { PokemonsService } from './pokemons.service';
import { SkipThrottle } from '@nestjs/throttler';

@Resolver('Pokemons')
export class PokemonsResolver {
  constructor(private readonly pokemonService: PokemonsService) {}

  @SkipThrottle()
  @Query('pokemons')
  pokemons() {
    return this.pokemonService.getPokemons({
      query: {},
      pagination: { limit: 10, page: 1 },
      sort: {},
    });
  }
}
