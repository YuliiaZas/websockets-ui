import { RegistrationRequest } from '../entities/registration.type';

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

// export function isPlayer(data: unknown): data is Player {
//   return (
//     typeof data === 'object' &&
//     data !== null &&
//     'index' in data &&
//     'name' in data &&
//     'password' in data &&
//     'wins' in data
//   );
// }
