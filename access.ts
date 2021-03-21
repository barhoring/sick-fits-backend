import { permissionsList } from './schemas/fields';
import { ListAccessArgs } from './types';
// At it's simplest, the access control returns a yes or no value depending on the users session

export function isSignedIn({ session }: ListAccessArgs) {
  return !!session;
}

const generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function ({ session }: ListAccessArgs) {
      return !!session?.data.role?.[permission];
    },
  ])
);

// Permissions check if someone meets a critiria - yes / no
export const permissions = {
  ...generatedPermissions,
  // example of a new permission on top of the generatedPermissions
  isAwesome({ session }: ListAccessArgs): boolean {
    return session?.data.name.includes('wes');
  },
};

// Rule based function
// Rules can return a boolean or a filter which limits which product they can CRUD
export const rules = {
  canManageProducts({ session }: ListAccessArgs) {
    // 1. Do they have the permmission of canNManageProducts
    if (permissions.canManageProducts({ session })) {
      return true;
    }
    // 2. If not - do they own this product
    return { user: { id: session.itemId } };
  },
  canReadProducts({ session }: ListAccessArgs) {
    if (permissions.canManageProducts({ session })) return true;
    return { status: 'AVAILABLE' };
  },
};
