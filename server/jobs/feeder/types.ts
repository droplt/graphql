import { NormalizedTorrent } from '../../services/bittorrent';

export interface Feed {
  [hash: string]: Record<string, NormalizedTorrent>;
}

export interface Torrent extends NormalizedTorrent {
  uuid: string;
}
