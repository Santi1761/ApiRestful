import { gql } from "apollo-server-express";

const typeDefs = gql`
  type User {
    id: ID!
    username: String!
    email: String!
    role: String!
  }

  type Comment {
    id: ID!
    content: String!
    author: User!
    parentId: ID
    reactions: [Reaction]
    createdAt: String!
    updatedAt: String!
  }

  type Reaction {
    id: ID!
    type: String!
    user: User!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  input UserInput {
    username: String!
    email: String!
    password: String!
    role: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input CommentInput {
    content: String!
    parentId: ID
  }

  type Query {
    getAllUsers: [User!]
    getUserById(id: ID!): User

    getAllComments: [Comment!]
    getCommentById(id: ID!): Comment
  }

  type Mutation {
    register(input: UserInput!): User!
    login(input: LoginInput!): AuthPayload!
    updateUser(id: ID!, input: UserInput!): User
    deleteUser(id: ID!): User

    createComment(input: CommentInput!): Comment!
    updateComment(id: ID!, input: CommentInput!): Comment
    deleteComment(id: ID!): Comment
  }
`;

export default typeDefs;
