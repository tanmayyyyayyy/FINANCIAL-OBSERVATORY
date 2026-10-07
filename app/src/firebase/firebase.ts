import { getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
  persistentMultipleTabManager,
} from 'firebase/firestore'
import { firebaseConfig, isFirebaseConfigured } from './config'

export const firebaseApp = isFirebaseConfigured
	? getApps().find((app) => app.name === '[DEFAULT]') ?? initializeApp(firebaseConfig)
	: null

export const auth = firebaseApp ? getAuth(firebaseApp) : null

export const db = (() => {
  if (!firebaseApp) return null;
  try {
    return initializeFirestore(firebaseApp, {
      localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager(),
      }),
    });
  } catch {
    return getFirestore(firebaseApp);
  }
})();