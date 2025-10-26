import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Pokemon } from '@prisma/client';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UniquePokemonQuery } from './pokemons.types';

@Injectable()
export class PokemonsService {
  constructor(private prisma: PrismaService) {}

  async getPokemons(getPokemonsDto: {
    query: { type?: string; name?: string };
    pagination: { page: number; limit: number };
    sort: { sortBy?; sortOrder? };
  }): Promise<{ data: Pokemon[]; total }> {
    const { query, pagination, sort } = getPokemonsDto;

    const where = this.buildWhereQuery(query);
    const total = await this.prisma.pokemon.count({ where });
    const data = await this.prisma.pokemon.findMany({
      where,
      take: pagination.limit,
      skip: (pagination.page - 1) * pagination.limit,
      orderBy: {
        [sort.sortBy]: sort.sortOrder,
      },
      include: {
        types: {
          select: { type: true },
        },
      },
    });
    return { data, total };
  }

  async createPokemon(data: CreatePokemonDto): Promise<Pokemon> {
    const pokemonData = { name: data.name };
    return this.prisma.pokemon.create({
      data: {
        ...pokemonData,
        types: {
          create: this.buildCreateTypesData(data.types),
        },
      },
      include: {
        types: {
          select: { type: true },
        },
      },
    });
  }

  async deletePokemon(where: UniquePokemonQuery): Promise<void> {
    await this.prisma.typesOnPokemons.deleteMany({
      where: { pokemon_id: where.id },
    });
    await this.prisma.pokemon.delete({
      where,
    });
  }

  async updatePokemon(params: {
    where: UniquePokemonQuery;
    data: UpdatePokemonDto;
  }): Promise<Pokemon> {
    const { where, data } = params;

    await this.prisma.typesOnPokemons.deleteMany({
      where: { pokemon_id: where.id },
    });

    return this.prisma.pokemon.update({
      data: {
        name: data.name,
        types: {
          create: this.buildCreateTypesData(data.types),
        },
      },
      where,
      include: {
        types: {
          select: { type: true },
        },
      },
    });
  }

  private buildWhereQuery(query: { type?: string; name?: string }) {
    const whereNameQuery = query.name ? { name: { contains: query.name } } : {};
    const whereTypeQuery = query.type
      ? { types: { some: { type: { name: query.type } } } }
      : {};
    return { ...whereNameQuery, ...whereTypeQuery };
  }

  private buildCreateTypesData(types: string[]) {
    return types.map((typeName) => ({
      type: {
        connectOrCreate: {
          where: { name: typeName },
          create: { name: typeName },
        },
      },
    }));
  }
}
