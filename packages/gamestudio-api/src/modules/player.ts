import type { PlayerContext } from './config';

export interface PlayerProvider<RequestContext = unknown> {
  resolve(request: RequestContext): Promise<PlayerContext>;
}

export interface PlayerLookup {
  studioId: string;
  gameId: string;
}

export interface PlayerQuery<RequestContext = unknown> extends PlayerLookup {
  request: RequestContext;
}