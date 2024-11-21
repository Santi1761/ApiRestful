import { IResolvers } from "@graphql-tools/utils";
import UserService from "../../services/users.Services";
import CommentService from "../../services/comments.Services";
import { UserDocument } from "../../models/users.Models";
import { CommentDocument } from "../../models/comments.Models";
import { GraphQLError } from "graphql";

const resolvers: IResolvers = {
    Query: {
        getAllUsers: async (_, __, { loggedUser }) => {
            if (!loggedUser || loggedUser.role !== "superadmin") {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await UserService.getAll();
        },
        getUserById: async (_, { id }, { loggedUser }) => {
            if (!loggedUser) {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await UserService.getById(id);
        },

        getAllComments: async (_, __, { loggedUser }) => {
            if (!loggedUser) {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await CommentService.getAll();
        },
        getCommentById: async (_, { id }, { loggedUser }) => {
            if (!loggedUser) {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await CommentService.getById(id);
        },
    },

    Mutation: {

        register: async (_, { input }) => {
            const user: UserDocument = await UserService.register(input);
            return user;
        },
        login: async (_, { input }) => {
            const { token, user } = await UserService.login(input);
            return { token, user };
        },
        updateUser: async (_, { id, input }, { loggedUser }) => {
            if (!loggedUser || loggedUser.role !== "superadmin") {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await UserService.update(id, input);
        },
        deleteUser: async (_, { id }, { loggedUser }) => {
            if (!loggedUser || loggedUser.role !== "superadmin") {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            return await UserService.delete(id);
        },

        createComment: async (_, { input }, { loggedUser }) => {
            if (!loggedUser) {
                throw new GraphQLError("No autorizado", { extensions: { code: "FORBIDDEN" } });
            }
            const commentData: CommentDocument = {
                ...input,
                author: loggedUser.user_id,
            };
            return await CommentService.create(commentData);
        },
        updateComment: async (_, { id, input }, { loggedUser }) => {
            const comment = await CommentService.getById(id);
            if (!comment || comment.author.toString() !== loggedUser.user_id) {
                throw new GraphQLError("No autorizado para modificar este comentario", { extensions: { code: "FORBIDDEN" } });
            }
            return await CommentService.update(id, input);
        },
        deleteComment: async (_, { id }, { loggedUser }) => {
            const comment = await CommentService.getById(id);
            if (!comment || comment.author.toString() !== loggedUser.user_id) {
                throw new GraphQLError("No autorizado para eliminar este comentario", { extensions: { code: "FORBIDDEN" } });
            }
            return await CommentService.delete(id);
        },
    },
};

export default resolvers;
