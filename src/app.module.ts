import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { join } from "path";
import { ApolloServerPluginLandingPageLocalDefault } from "@apollo/server/plugin/landingPage/default";
import { HelloModule } from "./modules/hello/hello.module";
import { PokemonModule } from "./modules/pokemon/pokemons.module";
import { PrismaModule } from "./modules/prisma/prisma.module";
import { TypeOrmModule } from "@nestjs/typeorm";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { APP_GUARD } from "@nestjs/core";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ["./**/*.graphql"],
      playground: false,
      plugins: [ApolloServerPluginLandingPageLocalDefault()],
      definitions: {
        path: join(process.cwd(), "src/graphql.ts"),
      },
    }),
    HelloModule,
    PokemonModule,
    PrismaModule,
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: "./database/database_orm.sqlite",
      autoLoadEntities: true,
      synchronize: true,
      migrations: ["../typeorm/migrations/*.ts"],
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
  controllers: [],
  providers: [{
    provide: APP_GUARD,
    useClass: ThrottlerGuard
  }],
})
export class AppModule {}
