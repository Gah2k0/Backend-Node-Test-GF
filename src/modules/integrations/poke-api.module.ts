import { Global, Module } from '@nestjs/common';
import { PokeApiService } from './poke-api.service';

@Global()
@Module({
  providers: [PokeApiService],
  exports: [PokeApiService],
})
export class PokeApiModule {}
