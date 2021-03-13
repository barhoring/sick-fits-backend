import { graphQLSchemaExtension } from '@keystone-next/keystone/schema';
import addToCart from './addToCart';
import checkout from './checkout';

// Hack to fake graphql tagged templates literal
const graphql = String.raw;
export const extendGraphqlSchema = graphQLSchemaExtension({
  typeDefs: graphql`
    type Mutation {
      addToCart(productId: ID): CartItem
      checkout(token: String!): Order
    }
  `,
  resolvers: {
    Mutation: {
      addToCart,
      checkout,
    },
  },
});
