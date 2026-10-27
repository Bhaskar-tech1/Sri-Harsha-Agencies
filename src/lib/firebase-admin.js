import { applicationDefault, cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

function getRawServiceAccount() {
  return (
    process.env.FIREBASE_SERVICE_ACCOUNT_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT ||
    process.env.FIREBASE_ADMIN_CREDENTIALS
  );
}

function getClientEmail() {
  return (
    process.env.FIREBASE_CLIENT_EMAIL ||
    process.env.FIREBASE_ADMIN_CLIENT_EMAIL ||
    process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL ||
    process.env.GOOGLE_CLIENT_EMAIL
  );
}

function getPrivateKey() {
  return (
    process.env.FIREBASE_PRIVATE_KEY ||
    process.env.FIREBASE_ADMIN_PRIVATE_KEY ||
    process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY ||
    process.env.GOOGLE_PRIVATE_KEY
  );
}

function readServiceAccount() {
  const rawServiceAccount = getRawServiceAccount();
  if (rawServiceAccount) {
    try {
      return JSON.parse(rawServiceAccount);
    } catch {
      throw new Error('Firebase Admin service account JSON is invalid.');
    }
  }

  const clientEmail = getClientEmail();
  const privateKey = getPrivateKey();
  if (clientEmail && privateKey) {
    return {
      project_id: process.env.FIREBASE_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      client_email: clientEmail,
      private_key: privateKey.replace(/\\n/g, '\n'),
    };
  }

  if (clientEmail || privateKey) {
    throw new Error('Set both FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY for Firebase Admin.');
  }

  return null;
}

export function hasFirebaseAdminCredentials() {
  return Boolean(
    getRawServiceAccount() ||
    getClientEmail() ||
    getPrivateKey() ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS ||
    process.env.NODE_ENV === 'production'
  );
}

export function getDb() {
  const existingApp = getApps()[0];
  if (existingApp) return getFirestore(existingApp);

  const serviceAccount = readServiceAccount();
  const useApplicationDefaultCredentials =
    process.env.GOOGLE_APPLICATION_CREDENTIALS || process.env.NODE_ENV === 'production';

  if (!serviceAccount && !useApplicationDefaultCredentials) return null;

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    serviceAccount?.project_id;
  const credential = serviceAccount ? cert(serviceAccount) : applicationDefault();
  const app = initializeApp({ credential, ...(projectId ? { projectId } : {}) });
  return getFirestore(app);
}

export const db = new Proxy({}, {
  get(target, prop) {
    const database = getDb();
    if (!database) {
      throw new Error('Firebase Admin credentials are not configured.');
    }
    const value = database[prop];
    return typeof value === 'function' ? value.bind(database) : value;
  },
});
