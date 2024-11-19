import { makeExecutableSchema } from '@graphql-tools/schema';
import User from '../models/users.Models';

export const schema = makeExecutableSchema({
    typeDefs: `
        type User {
            id: ID!
            username: String!
            email: String!
            role: String!
        }

        type Query {
            getUsers: [User!]!
            getUser(id: ID!): User
        }

        type Mutation {
            createUser(username: String!, email: String!, password: String!, role: String!): User
            deleteUser(id: ID!): Boolean
        }
    `,
    resolvers: {
        Query: {
            getUsers: async () => {
                return await User.find();
            },
            getUser: async (_: any, { id }: { id: string }) => {
                return await User.findById(id);
            },
        },
        Mutation: {
            createUser: async (_: any, { username, email, password, role }: any) => {
                const user = new User({ username, email, password, role });
                await user.save();
                return user;
            },
            deleteUser: async (_: any, { id }: { id: string }) => {
                const result = await User.findByIdAndDelete(id);
                return !!result;
            },
        },
    },
});