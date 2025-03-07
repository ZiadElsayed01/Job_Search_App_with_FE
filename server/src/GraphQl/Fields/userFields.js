import { listUsersResolvers } from "../Resolver/userResolver.js";
import { banUserResolvers } from "../Resolver/userResolver.js";
import { unbanUserResolvers } from "../Resolver/userResolver.js";
import { userTypes } from "../Types/userTypes.js";
import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";

export const userFields = {
  Query: {
    listUsers: {
      type: new GraphQLList(userTypes),
      resolve: () => {
        return listUsersResolvers();
      },
    },
  },
  Mutation: {
    banUser: {
      type: userTypes,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return banUserResolvers(_, args);
      },
    },
    unbanUser: {
      type: userTypes,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return unbanUserResolvers(_, args);
      },
    },
  },
};
