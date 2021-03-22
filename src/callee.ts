import { Event, createEvent, Store, createStore, split } from 'effector'

import { DTO, TMessage, TMessages, TEffects, TEvents, TConsumer } from './types'

// export type TReceiveEffect = Effect<IMessage<DTO>, IMessage<DTO> | void>
// export type TReceiverFunction = (request: IMessage<DTO>) => Promise<DTO>

export type TReceiveEvent = Event<TMessage<DTO>>
export type TReplyEvent = Event<TMessage<DTO>>

export interface ICalleeOptions<
  F extends TEffects,
  E extends TEvents,
  C extends TConsumer
> {
  effects: F
  events: E
  consumer: C
}

export interface ICallee<F, E> {
  queue: Store<TMessages>
  effects: F
  events: E
  receive: TReceiveEvent
  reply: TReplyEvent
}

export interface ICalleeFactory {
  <F extends TEffects, E extends TEvents, C extends TConsumer>(
    options: ICalleeOptions<F, E, C>
  ): ICallee<F, E>
}

/**
 * Вызываемый
 */
export const Callee: ICalleeFactory = ({ effects, events, consumer }) => {
  const queue: Store<TMessages> = createStore({})

  const receive: TReceiveEvent = createEvent('receive')
  const reply: TReplyEvent = createEvent('reply')

  // Effects
  const receivedEffectRequest = receive.filter({
    fn: (message) =>
      message.type === 'request' && message.subj.type === 'effect',
  })

  Object.values(effects).forEach((effect) => {
    effect.done
      .map(
        ({ params: request, result }): TMessage<DTO> => ({
          id: request.id,
          type: 'result',
          subj: request.subj,
          from: consumer,
          payload: result,
        })
      )
      .watch(reply)

    effect.fail
      .map(
        ({ params: request, error }): TMessage<DTO> => ({
          id: request.id,
          type: 'error',
          subj: request.subj,
          from: consumer,
          payload: { message: error.message },
        })
      )
      .watch(reply)
  })

  split({
    source: receivedEffectRequest,
    match: (message) => message.subj.id,
    cases: effects,
  })

  // Events
  const receivedEventRequest = receive.filter({
    fn: (message) =>
      message.type === 'request' && message.subj.type === 'event',
  })

  split({
    source: receivedEventRequest,
    match: (message) => message.subj.id,
    cases: events,
  })

  // Update queue for effects
  queue
    .on(receivedEffectRequest, (state, request) => {
      return {
        ...state,
        [request.id]: request,
      }
    })
    .on(reply, (state, { id }) => {
      const { [id]: _, ...rest } = state
      return rest
    })

  return {
    queue,
    effects,
    events,
    receive,
    reply,
  }
}
