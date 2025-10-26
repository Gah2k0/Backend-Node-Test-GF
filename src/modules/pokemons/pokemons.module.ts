import { Module } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";
import { PokemonsResolver } from "./pokemons.resolver";
import { PokemonsController } from "./pokemons.controller";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_GUARD } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
  imports: [ 
    CacheModule.register({
      ttl: 20000
    }),
     ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 20,
        },
      ],
    }),
  ],
  controllers: [PokemonsController],
  providers: [PokemonsResolver, PokemonsService,
    {
        provide: APP_GUARD,
        useClass: ThrottlerGuard
      }
  ],
})
export class PokemonModule {}
