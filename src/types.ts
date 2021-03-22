import { Effect, Event } from 'effector'

export type DTO = void | null | string | number | Array<any> | Record<string, any>

export type TConsumerType = 'server' | 'client'
export type TMessageType = 'request' | 'result' | 'error'
export type TSubjectType = 'effect' | 'event'

export type TConsumer = {
  type: TConsumerType
  id: string
}

export type TSubject = {
  type: TSubjectType
  id: string
}

export type TMessage<T extends DTO> = {
  id: string
  type: TMessageType
  subj: TSubject
  from: TConsumer
  payload: T
}

export type TMessages = Record<string, TMessage<DTO>>
export type TEffects = Record<string, Effect<TMessage<DTO>, DTO>>
export type TEvents = Record<string, Event<TMessage<DTO>>>

export class BaseError extends Error {
  constructor(message: string) {
    super(message)
    Object.setPrototypeOf(this, BaseError.prototype)
  }

  inspect() {
    return { message: this.message, type: this.name }
  }
}

export class EffectNotImplementedError extends BaseError {
  constructor(effectName: string) {
    super(`Effect handler for "${effectName}" not implemented`)
    Object.setPrototypeOf(this, EffectNotImplementedError.prototype)
  }
}

export class EffectNotFoundError extends BaseError {
  constructor(effectName: string) {
    super(`Effect "${effectName}" not found`)
    Object.setPrototypeOf(this, EffectNotFoundError.prototype)
  }
}

export class EventNotFoundError extends BaseError {
  constructor(eventName: string) {
    super(`Event "${eventName}" not found`)
    Object.setPrototypeOf(this, EventNotFoundError.prototype)
  }
}
