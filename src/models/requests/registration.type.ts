export type RegistrationRequest = {
  name: string;
  password: string;
};

export type RegistrationResponse = {
  name: string;
  index: string;
  error: boolean;
  errorText: string;
};
