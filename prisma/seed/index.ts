import prisma from './prisma.client';
import { pokemons } from './data/pokemon';

export default async function main() {
  await prisma.typesOnPokemons.deleteMany();
  await prisma.pokemon.deleteMany();
  await prisma.type.deleteMany();
  const types = Array.from(new Set(pokemons.map(p => (p.type))));
  await prisma.type.createMany({
    data: types.map(type => ({ name: type })),
  });
  await prisma.pokemon.createMany({
    data: pokemons.map(({ name, id }) => ({ name, id })),
  });
  const allTypes = await prisma.type.findMany();
  const typeMap = new Map(allTypes.map(t => [t.name, t.id]));
  await prisma.typesOnPokemons.createMany({
    data: pokemons.map(({ id, type }) => ({ type_id: typeMap.get(type), pokemon_id: id })),
  });
}

main()
  .catch((error) => {
    console.error('Error seeding the database:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('Seeding completed successfully');
  });
