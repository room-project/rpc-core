import UUID from 'pure-uuid'

import { Effect } from 'effector'

import {
  DTO,
  TMessage,
  TEffects,
  TEvents,
  TConsumer,
} from './types'

export type TSendEffect = Effect<TMessage<DTO>, TMessage<DTO>>

export interface ICallerOptions<
  F extends TEffects,
  E extends TEvents,
  S extends TSendEffect
> {
  effects: F
  events: E
  consumer: TConsumer
  send: S
}

export interface ICaller<F, E> {
  effects: F
  events: E
}

export interface ICallerFactory {
  <
    F extends TEffects,
    E extends TEvents,
    S extends TSendEffect
  >(
    options: ICallerOptions<F, E, S>
  ): ICaller<F, E>
}

/**
 * Вызыватель
 */
export const Caller: ICallerFactory = ({ effects, events, consumer, send }) => {
  Object.entries(effects).forEach(([name, effect]) => {
    effect.shortName = name
    effect.use(async <Params extends DTO>(params: Params) => {
      try {
        const message: TMessage<Params> = {
          id: new UUID(4).toString(),
          type: 'request',
          subj: {
            type: 'effect',
            id: name
          },
          from: consumer,
          payload: params,
        }
        const response = await send(message)
        return response.payload
      } catch (error) {
        throw error
      }
    })
  })

  Object.entries(events).forEach(([name, event]) => {
    event.shortName = name
    event.watch(<Params extends DTO>(params: Params) => {
      const message: TMessage<Params> = {
        id: new UUID(4).toString(),
        type: 'request',
        subj: {
          type: 'event',
          id: name,
        },
        from: consumer,
        payload: params,
      }
      send(message)
    })
  })

  return {
    effects,
    events,
  }
}
