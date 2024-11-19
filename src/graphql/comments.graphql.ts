import { gql } from 'graphql-tag';
import Comment from '../models/comments.Models';

export const commentTypeDefs = gql`
  type Comment {
    id: ID!
    content: String!
    author: ID!
    parentId: ID
    reactions: [Reaction]
  }

  type Reaction {
    user: ID!
    type: String!
  }

  type Query {
    getComments: [Comment!]!
    getComment(id: ID!): Comment
  }

  type Mutation {
    createComment(content: String!, author: ID!, parentId: ID): Comment
    deleteComment(id: ID!): Boolean
  }
`;

export const commentResolvers = {
    Query: {
        getComments: async () => {
            return await Comment.find();
        },
        getComment: async (_: any, { id }: { id: string }) => {
            return await Comment.findById(id);
        },
    },
    Mutation: {
        createComment: async (_: any, { content, author, parentId }: any) => {
            const comment = new Comment({ content, author, parentId });
            await comment.save();
            return comment;
        },
        deleteComment: async (_: any, { id }: { id: string }) => {
            const result = await Comment.findByIdAndDelete(id);
            return !!result;
        },
    },
};
