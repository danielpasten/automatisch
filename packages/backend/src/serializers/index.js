import userSerializer from './user.js';
import roleSerializer from './role.js';
import permissionSerializer from './permission.js';
import appAuthClientSerializer from './appAuthClientSerializer.js';

const serializers = {
  User: userSerializer,
  Role: roleSerializer,
  Permission: permissionSerializer,
  AppAuthClient: appAuthClientSerializer,
};

export default serializers;
