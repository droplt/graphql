import { AsyncTask } from 'toad-scheduler';

export default new AsyncTask(
  '',
  () => {
    console.log('coucou');

    return Promise.resolve();
  },
  (err: Error) => {
    return Promise.reject(err);
  }
);
