import { GraphQLJSON } from 'graphql-type-json';
import { prisma } from '../db';
import { fetchWeatherData } from '../services/weather';
import { createPropertySchema } from '../utils/validators';
import { boolean, ZodError } from 'zod';
import { GraphQLError } from 'graphql/error';

export const resolvers = {
  JSON: GraphQLJSON,

  Query: {
    properties: async (
      _: any,
      args: {
        filter?: { city?: string; zipCode?: string; state?: string };
        sortByDateDesc?: boolean;
      },
    ) => {
      const { filter, sortByDateDesc } = args;

      const where = {};

      return await prisma.property.findMany({
        where: {
          city: filter?.city ? filter.city : undefined,
          zipCode: filter?.zipCode ? filter.zipCode : undefined,
          state: filter?.state ? filter.city : undefined,
        },
        orderBy: sortByDateDesc ? { createdAt: 'desc' } : undefined,
      });
    },

    property: async (_: any, args: { id: string }) => {
      return await prisma.property.findUnique({
        where: {
          id: args.id,
        },
      });
    },
  },

  Mutation: {
    createProperty: async (
      _: any,
      args: { city: string; street: string; zipCode: string; state: string },
    ) => {
      try {
        const validArgs = createPropertySchema.parse(args);
        const weather = await fetchWeatherData(validArgs.city);

        return prisma.property.create({
          data: {
            city: validArgs.city,
            street: validArgs.street,
            state: validArgs.state,
            zipCode: validArgs.zipCode,
            lat: weather.lat,
            long: weather.lon,
            weatherData: weather.weatherData as any,
          },
        });
      } catch (err) {
        if (err instanceof ZodError) {
          const message = err.issues.map((error) => error.message).join();
          throw new GraphQLError(message);
        }
        throw err;
      }
    },

    deleteProperty: async (_: any, args: { id: string }) => {
      return await prisma.property.delete({
        where: { id: args.id },
      });
    },
  },
};
