import * as fireorm from 'fireorm';

import firebase from './firebase';

fireorm.initialize(firebase.firestore());
