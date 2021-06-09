import { NormalizedTorrent } from '@ctrl/shared-torrent';
import { NIL, v5 as uuidv5 } from 'uuid';

const getUuid = (torrent: NormalizedTorrent): string => {
  const { name, totalSize } = torrent;
  return uuidv5(`${name}-${totalSize}`, NIL);
};

export default getUuid;
