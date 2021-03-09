import { Domain, Effect, Event } from 'effector'
import UUID from 'pure-uuid'

export { UUID }

export const createUUIDv4 = () => new UUID(4)

// Protocol

export type RpcMessageId = string | number
export type RpcMessageName = string
export type RpcMessageParams = object | void
export type RpcMessageResult = any

export interface IRpcMessageError {
  message: string
  code?: number | null
}

export interface IRpcRequest {
  id: RpcMessageId
  name: RpcMessageName
  params: RpcMessageParams
}

export interface IRpcResponse {
  id: RpcMessageId
  result?: RpcMessageResult
  error?: IRpcMessageError
}

// Service

export type IRpcServiceMethod = Effect<RpcMessageParams, RpcMessageResult, Error>

export interface IRpcServiceMethods {
  [key: string]: IRpcServiceMethod
}

export interface IRpcService {
  domain: Domain
  methods: IRpcServiceMethods
}

// Client Transport

export interface IRpcClientTransport {
  send: Effect<string, string | null>
  open?: () => Promise<void>
  close?: () => Promise<void>
}

// Client

export interface IRpcClient<S, T> {
  readonly service: S
  readonly transport: T
}

export interface IRpcClientFactoryOptions<S, T> {
  service: S
  transport: T
}

export interface IRpcClientFactory {
  <T extends IRpcClientTransport, S extends IRpcService>(
    options: IRpcClientFactoryOptions<S, T>
  ): IRpcClient<S, T>
  of: IRpcClientFactory
}

// Server Transport

export interface IRpcServerTransport {
  receive: Event<IRpcRequest>
  send: Event<IRpcResponse>
  open?: () => Promise<void>
  close?: () => Promise<void>
}

// Server

export interface IRpcServer<S, T> {
  readonly service: S
  readonly transport: T
}

export interface IRpcServerFactoryOptions<S, T> {
  service: S
  transport: T
}

export interface IRpcServerFactory {
  <S extends IRpcService, T extends IRpcServerTransport>(
    options: IRpcServerFactoryOptions<S, T>
  ): IRpcServer<S, T>
  of: IRpcServerFactory
}
