import { AddUserToRoomRequest } from '../models/requests/addUserToRoom.type';
import { RegistrationRequest } from '../models/requests/registration.type';

export function isRegistrationRequest(
  data: unknown
): data is RegistrationRequest {
  return (
    typeof data === 'object' &&
    data !== null &&
    'name' in data &&
    'password' in data &&
    typeof (data as RegistrationRequest).name === 'string' &&
    typeof (data as RegistrationRequest).password === 'string'
  );
}

export function isCreateRoomRequest(
  data: unknown
): data is AddUserToRoomRequest {
  console.log('isCreateRoomRequest', data);
  return (
    typeof data === 'object' &&
    data !== null &&
    'indexRoom' in data &&
    typeof (data as AddUserToRoomRequest).indexRoom === 'string'
  );
}
