import { AsyncTask } from 'toad-scheduler';

import Handler from './handler';
const handler = new Handler();

export default new AsyncTask('feed', () => handler.run(), handler.onError);
