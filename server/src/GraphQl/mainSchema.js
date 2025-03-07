import { GraphQLObjectType, GraphQLSchema } from "graphql";
import { userFields } from "./Fields/userFields.js";
import { companyFields } from "./Fields/companyFields.js";

export const mainSchema = new GraphQLSchema({
  query: new GraphQLObjectType({
    name: "Query",
    fields: {
      ...userFields.Query,
      ...companyFields.Query,
    },
  }),
  mutation: new GraphQLObjectType({
    name: "Mutation",
    fields: {
      ...userFields.Mutation,
      ...companyFields.Mutation,
    },
  }),
});
