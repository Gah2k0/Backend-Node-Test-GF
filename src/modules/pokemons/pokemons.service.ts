import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pokemon } from '@prisma/client';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UniquePokemonQuery } from './pokemons.types';

@Injectable()
export class PokemonsService {
  constructor(private prisma: PrismaService) {}

  async getPokemons(getPokemonsDto: { query: { type?: string, name?: string }, pagination: { page: number, limit: number }, sort: { sortBy?, sortOrder? } }): Promise<{ data: Pokemon[], total }> {
    const { query, pagination, sort } = getPokemonsDto;
    const where = query.name ? { ...query, name: { contains: query.name} } : query;
    const total = await this.prisma.pokemon.count({where});
    const data = await this.prisma.pokemon.findMany({
      where,
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      orderBy: {
        [sort.sortBy]: sort.sortOrder
      }
    });
    return { data, total};
  }

  async createPokemon(data: CreatePokemonDto): Promise<Pokemon> {
    return this.prisma.pokemon.create({
      data
    });
  }

  async deletePokemon(where: UniquePokemonQuery): Promise<Pokemon> {
    return this.prisma.pokemon.delete({
      where
    });
  }

  async updatePokemon(params: {
    where: UniquePokemonQuery;
    data: UpdatePokemonDto;
  }): Promise<Pokemon> {
    const { where, data } = params;
    return this.prisma.pokemon.update({
      data, 
      where,
    });
  }
}
