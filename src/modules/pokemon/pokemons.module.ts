import { Module } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";
import { PokemonsResolver } from "./pokemons.resolver";
import { PokemonsController } from "./pokemons.controller";
import { CacheModule } from "@nestjs/cache-manager";

@Module({
  imports: [ 
    CacheModule.register({
      ttl: 20000
    })
  ],
  controllers: [PokemonsController],
  providers: [PokemonsResolver, PokemonsService],
})
export class PokemonModule {}
