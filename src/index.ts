import { Domain, Effect } from 'effector'
import UUID from 'pure-uuid'

export const createUUIDv4 = () => new UUID(4)

// Protocol

export type RpcMessageId = string | number
export type RpcMessageName = string
export type RpcMessageParams = void | any
export type RpcMessageResult = any

export interface IRpcMessageError {
  message: string
  type?: string
  code?: number
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
