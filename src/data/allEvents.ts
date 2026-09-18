import { GameEvent } from '../types/event';
import { EVENTS } from './events';
import { ADDITIONAL_EVENTS } from './moreEvents';

export const ALL_EVENTS: GameEvent[] = [...EVENTS, ...ADDITIONAL_EVENTS];
