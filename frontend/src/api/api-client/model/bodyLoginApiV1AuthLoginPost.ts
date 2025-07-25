/**
 * Generated by orval v7.10.0 🍺
 * Do not edit manually.
 * NoteApp API
 * A simple note app with folders and user support.
 * OpenAPI spec version: 1.0.0
 */
import type { BodyLoginApiV1AuthLoginPostGrantType } from "./bodyLoginApiV1AuthLoginPostGrantType";
import type { BodyLoginApiV1AuthLoginPostClientId } from "./bodyLoginApiV1AuthLoginPostClientId";
import type { BodyLoginApiV1AuthLoginPostClientSecret } from "./bodyLoginApiV1AuthLoginPostClientSecret";

export interface BodyLoginApiV1AuthLoginPost {
  grant_type?: BodyLoginApiV1AuthLoginPostGrantType;
  username: string;
  password: string;
  scope?: string;
  client_id?: BodyLoginApiV1AuthLoginPostClientId;
  client_secret?: BodyLoginApiV1AuthLoginPostClientSecret;
}
