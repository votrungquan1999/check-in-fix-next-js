import firebase from 'firebase';
import { isNil } from 'lodash/fp';

var storage: firebase.storage.Storage;

export function getFirebaseStorage() {
  if (!isNil(storage)) {
    return storage;
  }

  if (!firebase.apps.length) {
    return;
  }

  storage = firebase.storage();
  return storage;
}
