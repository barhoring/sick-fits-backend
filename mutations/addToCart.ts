/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  // 1. Query the current user see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this!');
  }

  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity'
  });
  
  const [existingCartItem] = allCartItems;
  if (existingCartItem) {
    console.log(
      `This are already ${existingCartItem.quantity} itemד in the cart. Increment by 1`
    );
    // 3. See if the current item is already in their cart
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 }, // then update its quantity
      resolveFields: false,
    });

  }
  console.log("Ceating new CartItem");
  
  // 4. If isn't, create a new item
  return await context.lists.CartItem.createOne({
    data: { 
      product: {connect : { id: productId }}, 
      user: { connect: { id: sesh.itemId }}
    },
    resolveFields: false,
  });
  
}
export default addToCart;
