import { randomUUID } from 'node:crypto';
import { clientDb } from './firebase-client';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';

const COLLECTION = 'products';

function timestampValue(value) {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  return 0;
}

function sortProducts(products) {
  return products.sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
}

export async function getAllProducts() {
  try {
    const snapshot = await getDocs(collection(clientDb, COLLECTION));
    const products = snapshot.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id,
    }));
    return sortProducts(products);
  } catch (err) {
    console.error('Firestore getDocs error:', err?.message);
    return [];
  }
}

export async function getProductById(id) {
  try {
    const docRef = doc(clientDb, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id };
    }
  } catch (err) {
    console.error('Firestore getDoc error:', err?.message);
  }
  return null;
}

export async function addProduct(productData) {
  const now = Date.now();
  const id = productData.id || `prod-${now}-${randomUUID().slice(0, 8)}`;
  const newProduct = {
    ...productData,
    id,
    createdAt: productData.createdAt || now,
    updatedAt: now,
    inStock: productData.inStock !== false,
    featured: productData.featured === true,
  };

  const docRef = doc(clientDb, COLLECTION, id);
  await setDoc(docRef, newProduct);
  return newProduct;
}

export async function updateProduct(id, updates) {
  const updateData = { ...updates, id, updatedAt: Date.now() };
  delete updateData.createdAt;

  const docRef = doc(clientDb, COLLECTION, id);
  await setDoc(docRef, updateData, { merge: true });
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return { ...snap.data(), id: snap.id };
  }
  return { ...updateData };
}

export async function deleteProduct(id) {
  const docRef = doc(clientDb, COLLECTION, id);
  await deleteDoc(docRef);
  return true;
}

export async function seedProducts(seedItems) {
  const now = Date.now();
  const productsToSeed = seedItems.map((item) => ({
    ...item,
    createdAt: item.createdAt || now,
    updatedAt: now,
  }));

  await Promise.all(
    productsToSeed.map((product) =>
      setDoc(doc(clientDb, COLLECTION, product.id), product, { merge: true })
    )
  );

  return productsToSeed.length;
}
