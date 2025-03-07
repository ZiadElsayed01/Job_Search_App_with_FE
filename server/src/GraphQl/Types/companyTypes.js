import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
} from "graphql";
import { numberOfEmployees } from "../../Constants/constants.js";

export const NumberOfEmployeesEnum = new GraphQLEnumType({
  name: "NumberOfEmployees",
  values: {
    LESSTEN: { value: numberOfEmployees.LESSTEN },
    LESSTWENTY: { value: numberOfEmployees.LESSTWENTY },
    LESSTHIRTITY: { value: numberOfEmployees.LESSTHIRTITY },
    LESSFIFTY: { value: numberOfEmployees.LESSFIFTY },
    LESSONEFIFTY: { value: numberOfEmployees.LESSONEFIFTY },
    MORE: { value: numberOfEmployees.MORE },
  },
});

export const FileType = new GraphQLObjectType({
  name: "File",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  },
});

export const companyTypes = new GraphQLObjectType({
  name: "Company",
  fields: {
    _id: { type: GraphQLID },
    companyName: { type: GraphQLString },
    description: { type: GraphQLString },
    industry: { type: GraphQLString },
    address: { type: GraphQLString },
    numberOfEmployees: { type: NumberOfEmployeesEnum },
    companyEmail: { type: GraphQLString },
    CreatedBy: { type: GraphQLID },
    Logo: { type: FileType },
    coverPic: { type: FileType },
    HRs: { type: new GraphQLList(GraphQLID) },
    bannedAt: { type: GraphQLString },
    deleted: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString },
    legalAttachment: { type: FileType },
    approvedByAdmin: { type: GraphQLBoolean },
    createdAt: { type: GraphQLString },
    updatedAt: { type: GraphQLString },
  },
});
