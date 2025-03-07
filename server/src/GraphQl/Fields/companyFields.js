import { GraphQLID, GraphQLList, GraphQLNonNull } from "graphql";
import { companyTypes } from "../Types/companyTypes.js";
import {
  approveCompanyResolvers,
  banCompanyResolvers,
  listCompaniesResolvers,
  unbanCompanyResolvers,
} from "../Resolver/companyResolver.js";

export const companyFields = {
  Query: {
    listCompanies: {
      type: new GraphQLList(companyTypes),
      resolve: () => {
        return listCompaniesResolvers();
      },
    },
  },
  Mutation: {
    banCompany: {
      type: companyTypes,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return banCompanyResolvers(_, args);
      },
    },
    unbanCompany: {
      type: companyTypes,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return unbanCompanyResolvers(_, args);
      },
    },
    approveCompany: {
      type: companyTypes,
      args: {
        _id: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve: (_, args) => {
        return approveCompanyResolvers(_, args);
      },
    },
  },
};
