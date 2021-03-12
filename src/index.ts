import { Domain, Effect, Event } from 'effector'
import UUID from 'pure-uuid'

import { version } from '../package.json'

export const VERSION = version

export const createUUIDv4 = () => new UUID(4)

// Protocol

export type RpcMethodId = string | number
export type RpcMethodName = string
export type RpcMethodParams = void | any
export type RpcMethodResult = any

export type RpcEventId = string | number
export type RpcEventName = string
export type RpcEventPayload = void | any

export interface IRpcMethodError {
  message: string
  type?: string
  code?: number
}

export interface IRpcMessageMethodRequest {
  id: RpcMethodId
  name: RpcMethodName
  params: RpcMethodParams
}

export interface IRpcMessageMethodResponse {
  id: RpcMethodId
  result?: RpcMethodResult
  error?: IRpcMethodError
}

export interface IRpcMessageEvent {
  id: RpcEventId
  name: RpcEventName
  payload?: RpcEventPayload
}

// Service

export type RpcServiceMethod = Effect<RpcMethodParams, RpcMethodResult, Error>
export type RpcServiceEvent = Event<RpcEventPayload>

export type RpcServiceMethods = Record<string, RpcServiceMethod>
export type RpcServiceEvents = Record<string, RpcServiceEvent>

export interface IRpcService {
  domain: Domain
  methods?: RpcServiceMethods
  events?: RpcServiceEvents
}
