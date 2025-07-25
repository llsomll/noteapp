/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * NoteApp API
 * A simple note app with folders and user support.
 * OpenAPI spec version: 1.0.0
 */
import { useMutation } from "@tanstack/react-query";
import type {
  MutationFunction,
  QueryClient,
  UseMutationOptions,
  UseMutationResult,
} from "@tanstack/react-query";

import type {
  BodyLogin,
  HTTPValidationError,
  Token,
  UserCreate,
  UserOut,
} from "./model";

import { customInstance } from "../api-config";

/**
 * Login with OAuth2 credentials. Returns access token in JSON and refresh token in HttpOnly cookie.
 * @summary Login
 */
export const login = (bodyLogin: BodyLogin, signal?: AbortSignal) => {
  const formUrlEncoded = new URLSearchParams();
  if (bodyLogin.grant_type !== undefined && bodyLogin.grant_type !== null) {
    formUrlEncoded.append(`grant_type`, bodyLogin.grant_type);
  }
  formUrlEncoded.append(`username`, bodyLogin.username);
  formUrlEncoded.append(`password`, bodyLogin.password);
  if (bodyLogin.scope !== undefined) {
    formUrlEncoded.append(`scope`, bodyLogin.scope);
  }
  if (bodyLogin.client_id !== undefined && bodyLogin.client_id !== null) {
    formUrlEncoded.append(`client_id`, bodyLogin.client_id);
  }
  if (
    bodyLogin.client_secret !== undefined &&
    bodyLogin.client_secret !== null
  ) {
    formUrlEncoded.append(`client_secret`, bodyLogin.client_secret);
  }

  return customInstance<Token>({
    url: `/api/v1/auth/login`,
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    data: formUrlEncoded,
    signal,
  });
};

export const getLoginMutationOptions = <
  TError = HTTPValidationError,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof login>>,
    TError,
    { data: BodyLogin },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: BodyLogin },
  TContext
> => {
  const mutationKey = ["login"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof login>>,
    { data: BodyLogin }
  > = (props) => {
    const { data } = props ?? {};

    return login(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type LoginMutationResult = NonNullable<
  Awaited<ReturnType<typeof login>>
>;
export type LoginMutationBody = BodyLogin;
export type LoginMutationError = HTTPValidationError;

/**
 * @summary Login
 */
export const useLogin = <TError = HTTPValidationError, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof login>>,
      TError,
      { data: BodyLogin },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof login>>,
  TError,
  { data: BodyLogin },
  TContext
> => {
  const mutationOptions = getLoginMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * @summary Logout
 */
export const logout = (signal?: AbortSignal) => {
  return customInstance<unknown>({
    url: `/api/v1/auth/logout`,
    method: "POST",
    signal,
  });
};

export const getLogoutMutationOptions = <
  TError = unknown,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof logout>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof logout>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["logout"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof logout>>,
    void
  > = () => {
    return logout();
  };

  return { mutationFn, ...mutationOptions };
};

export type LogoutMutationResult = NonNullable<
  Awaited<ReturnType<typeof logout>>
>;

export type LogoutMutationError = unknown;

/**
 * @summary Logout
 */
export const useLogout = <TError = unknown, TContext = unknown>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof logout>>,
      TError,
      void,
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof logout>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getLogoutMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * Create new user without the need to be logged in.
 * @summary Register User
 */
export const registerUser = (userCreate: UserCreate, signal?: AbortSignal) => {
  return customInstance<UserOut>({
    url: `/api/v1/auth/register`,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    data: userCreate,
    signal,
  });
};

export const getRegisterUserMutationOptions = <
  TError = HTTPValidationError,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof registerUser>>,
    TError,
    { data: UserCreate },
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: UserCreate },
  TContext
> => {
  const mutationKey = ["registerUser"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof registerUser>>,
    { data: UserCreate }
  > = (props) => {
    const { data } = props ?? {};

    return registerUser(data);
  };

  return { mutationFn, ...mutationOptions };
};

export type RegisterUserMutationResult = NonNullable<
  Awaited<ReturnType<typeof registerUser>>
>;
export type RegisterUserMutationBody = UserCreate;
export type RegisterUserMutationError = HTTPValidationError;

/**
 * @summary Register User
 */
export const useRegisterUser = <
  TError = HTTPValidationError,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof registerUser>>,
      TError,
      { data: UserCreate },
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof registerUser>>,
  TError,
  { data: UserCreate },
  TContext
> => {
  const mutationOptions = getRegisterUserMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
/**
 * @summary Refresh Token
 */
export const refreshToken = (signal?: AbortSignal) => {
  return customInstance<Token>({
    url: `/api/v1/auth/refresh`,
    method: "POST",
    signal,
  });
};

export const getRefreshTokenMutationOptions = <
  TError = HTTPValidationError,
  TContext = unknown,
>(options?: {
  mutation?: UseMutationOptions<
    Awaited<ReturnType<typeof refreshToken>>,
    TError,
    void,
    TContext
  >;
}): UseMutationOptions<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationKey = ["refreshToken"];
  const { mutation: mutationOptions } = options
    ? options.mutation &&
      "mutationKey" in options.mutation &&
      options.mutation.mutationKey
      ? options
      : { ...options, mutation: { ...options.mutation, mutationKey } }
    : { mutation: { mutationKey } };

  const mutationFn: MutationFunction<
    Awaited<ReturnType<typeof refreshToken>>,
    void
  > = () => {
    return refreshToken();
  };

  return { mutationFn, ...mutationOptions };
};

export type RefreshTokenMutationResult = NonNullable<
  Awaited<ReturnType<typeof refreshToken>>
>;

export type RefreshTokenMutationError = HTTPValidationError;

/**
 * @summary Refresh Token
 */
export const useRefreshToken = <
  TError = HTTPValidationError,
  TContext = unknown,
>(
  options?: {
    mutation?: UseMutationOptions<
      Awaited<ReturnType<typeof refreshToken>>,
      TError,
      void,
      TContext
    >;
  },
  queryClient?: QueryClient,
): UseMutationResult<
  Awaited<ReturnType<typeof refreshToken>>,
  TError,
  void,
  TContext
> => {
  const mutationOptions = getRefreshTokenMutationOptions(options);

  return useMutation(mutationOptions, queryClient);
};
