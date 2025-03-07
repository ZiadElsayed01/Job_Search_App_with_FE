import {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLEnumType,
  GraphQLList,
} from "graphql";

// Import constants
import {
  provider,
  gender,
  roles,
  type as otpType,
} from "../../Constants/constants.js";

// Define Provider Enum
export const ProviderEnum = new GraphQLEnumType({
  name: "Provider",
  values: {
    GOOGLE: { value: provider.GOOGLE },
    CREDENTIALS: { value: provider.CREDENTIALS },
  },
});

// Define Gender Enum
export const GenderEnum = new GraphQLEnumType({
  name: "Gender",
  values: {
    MALE: { value: gender.MALE },
    FEMALE: { value: gender.FEMALE },
    N_A: { value: gender.N_A },
  },
});

// Define Role Enum
export const RoleEnum = new GraphQLEnumType({
  name: "Role",
  values: {
    ADMIN: { value: roles.ADMIN },
    USER: { value: roles.USER },
    HR: { value: roles.HR },
    OWNER: { value: roles.OWNER },
    USER_OWNER: { value: roles.USER_OWNER },
  },
});

// Define OTPType Enum
export const OTPTypeEnum = new GraphQLEnumType({
  name: "OTPType",
  values: {
    CONFIRM_EMAIL: { value: otpType.CONFIRMEMAIL },
    FORGET_PASSWORD: { value: otpType.FORGETPASSWORD },
  },
});

// Define ProfilePic Type
export const ProfilePicType = new GraphQLObjectType({
  name: "ProfilePic",
  fields: {
    secure_url: { type: GraphQLString },
    public_id: { type: GraphQLString },
  },
});

// Define OTP Type
export const OTPType = new GraphQLObjectType({
  name: "OTP",
  fields: {
    code: { type: GraphQLString },
    type: { type: OTPTypeEnum },
    expiresIn: { type: GraphQLString },
  },
});

// Define User Type
export const userTypes = new GraphQLObjectType({
  name: "User",
  fields: {
    _id: { type: GraphQLID },
    firstName: { type: GraphQLString },
    lastName: { type: GraphQLString },
    email: { type: GraphQLString },
    password: { type: GraphQLString },
    provider: { type: ProviderEnum },
    gender: { type: GenderEnum },
    DOB: { type: GraphQLString },
    mobileNumber: { type: GraphQLString },
    role: { type: RoleEnum },
    isConfirmed: { type: GraphQLBoolean },
    deleted: { type: GraphQLBoolean },
    deletedAt: { type: GraphQLString },
    bannedAt: { type: GraphQLString },
    updatedBy: { type: GraphQLID },
    changeCredentialTime: { type: GraphQLString },
    profilePic: { type: ProfilePicType },
    coverPic: { type: ProfilePicType },
    OTP: { type: new GraphQLList(OTPType) }, // OTP is an array
  },
});
