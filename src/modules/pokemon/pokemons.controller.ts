import { Body, Controller, DefaultValuePipe, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseInterceptors, ValidationPipe } from "@nestjs/common";
import { PokemonsService } from "./pokemons.service";
import { Pokemon } from "@prisma/client";
import { CreatePokemonDto } from "./dto/create-pokemon.dto";
import { UpdatePokemonDto } from "./dto/update-pokemon.dto";
import { CacheInterceptor } from "@nestjs/cache-manager";
import { GetPokemonsQueryDto } from "./dto/get-pokemons.dto";

@Controller("pokemons")
export class PokemonsController {
  constructor(private readonly pokemonService: PokemonsService) {}

  @Get("/")
  @UseInterceptors(CacheInterceptor)
  @HttpCode(200)
  async getPokemons(
    @Query(new ValidationPipe({ transform: true, whitelist: true })){ page, limit, sortBy, sortOrder, type, name }: GetPokemonsQueryDto
  ): Promise<Pokemon[]> {
      return this.pokemonService.getPokemons({ query: { type, name }, pagination: { page, limit }, sort: { sortBy, sortOrder } });
  }
  @Post("/")
  @HttpCode(201)
  async createPokemon(
      @Body() createPokemonDto: CreatePokemonDto,
  ): Promise<Pokemon> {
    return this.pokemonService.createPokemon(createPokemonDto);
  }
  @Delete("/:id")
  @HttpCode(204)
  async deletePokemon(@Param('id') id: string): Promise<Pokemon> {
    return this.pokemonService.deletePokemon({ id: Number(id) });
  }
  @Put("/:id")
  @HttpCode(200)
  async updatePokemon(@Param('id') id: string, @Body() updatePokemonDto: UpdatePokemonDto): Promise<Pokemon> {
    return this.pokemonService.updatePokemon({ where: { id: Number(id) }, data: updatePokemonDto });
  }
}
