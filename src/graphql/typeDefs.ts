export const typeDefs = `#graphql
  scalar JSON

  type Property {
    id: ID!
    city: String!
    street: String!
    state: String!
    zipCode: String!
    lat: Float
    long: Float
    weatherData: JSON
    createdAt: String!
  }

  input PropertyFilter {
    city: String
    zipCode: String
    state: String
  }

  type Query {
    properties(filter: PropertyFilter, sortByDateDesc: Boolean): [Property!]!
    property(id: ID!): Property
  }

  type Mutation {
    createProperty(
      city: String!
      street: String!
      state: String!
      zipCode: String!
    ): Property!

    deleteProperty(id: ID!): Boolean!
  }
`;