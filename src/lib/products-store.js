import { randomUUID } from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import initialProducts from '../data/products.json';
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
const LOCAL_DATA_FILE = path.join(process.cwd(), '.data', 'products.json');
let localMutationQueue = Promise.resolve();
let localInitializationPromise = null;

function cloneInitialProducts() {
  return JSON.parse(JSON.stringify(initialProducts));
}

async function writeLocalProducts(products) {
  try {
    await fs.mkdir(path.dirname(LOCAL_DATA_FILE), { recursive: true });
    const temporaryFile = `${LOCAL_DATA_FILE}.${process.pid}.${randomUUID()}.tmp`;
    await fs.writeFile(temporaryFile, JSON.stringify(products, null, 2), 'utf8');
    await fs.rename(temporaryFile, LOCAL_DATA_FILE);
  } catch (error) {
    console.warn('Could not write local fallback file:', error?.message);
  }
}

async function initializeLocalProducts() {
  try {
    const content = await fs.readFile(LOCAL_DATA_FILE, 'utf8');
    const products = JSON.parse(content);
    if (!Array.isArray(products)) throw new Error('Local product data must be a JSON array.');
    return products;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    const products = cloneInitialProducts();
    await writeLocalProducts(products);
    return products;
  }
}

async function readLocalProducts() {
  try {
    const content = await fs.readFile(LOCAL_DATA_FILE, 'utf8');
    const products = JSON.parse(content);
    if (!Array.isArray(products)) throw new Error('Local product data must be a JSON array.');
    return products;
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;
    if (!localInitializationPromise) localInitializationPromise = initializeLocalProducts();
    try {
      return await localInitializationPromise;
    } finally {
      localInitializationPromise = null;
    }
  }
}

function timestampValue(value) {
  if (typeof value === 'number') return value;
  if (value instanceof Date) return value.getTime();
  if (value && typeof value.toMillis === 'function') return value.toMillis();
  return 0;
}

function sortProducts(products) {
  return products.sort((a, b) => timestampValue(b.createdAt) - timestampValue(a.createdAt));
}

function mutateLocalProducts(mutator) {
  const operation = localMutationQueue.then(async () => {
    const products = await readLocalProducts();
    const result = await mutator(products);
    if (result.persist !== false) await writeLocalProducts(products);
    return result.value;
  });

  localMutationQueue = operation.then(() => undefined, () => undefined);
  return operation;
}

export async function getAllProducts() {
  try {
    const snapshot = await getDocs(collection(clientDb, COLLECTION));
    const products = snapshot.docs.map((docSnap) => ({
      ...docSnap.data(),
      id: docSnap.id,
    }));
    writeLocalProducts(products).catch(() => {});
    return sortProducts(products);
  } catch (err) {
    console.error('Firestore getDocs error, falling back to local file:', err?.message);
  }

  return sortProducts(await readLocalProducts());
}

export async function getProductById(id) {
  try {
    const docRef = doc(clientDb, COLLECTION, id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { ...snap.data(), id: snap.id };
    }
  } catch (err) {
    console.error('Firestore getDoc error, falling back to local:', err?.message);
  }

  const products = await readLocalProducts();
  return products.find((product) => product.id === id) || null;
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

  try {
    const docRef = doc(clientDb, COLLECTION, id);
    await setDoc(docRef, newProduct);
  } catch (err) {
    console.error('Error saving to Firestore:', err);
  }

  // Also update local fallback cache
  await mutateLocalProducts((products) => {
    if (!products.some((p) => p.id === id)) {
      products.unshift(newProduct);
    }
    return { value: newProduct };
  }).catch(() => {});

  return newProduct;
}

export async function updateProduct(id, updates) {
  const updateData = { ...updates, id, updatedAt: Date.now() };
  delete updateData.createdAt;

  let updatedProduct = null;
  try {
    const docRef = doc(clientDb, COLLECTION, id);
    await setDoc(docRef, updateData, { merge: true });
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      updatedProduct = { ...snap.data(), id: snap.id };
    }
  } catch (err) {
    console.error('Error updating in Firestore:', err);
  }

  await mutateLocalProducts((products) => {
    const index = products.findIndex((product) => product.id === id);
    if (index >= 0) {
      products[index] = { ...products[index], ...updateData };
      if (!updatedProduct) updatedProduct = products[index];
    }
    return { value: updatedProduct };
  }).catch(() => {});

  return updatedProduct;
}

export async function deleteProduct(id) {
  try {
    const docRef = doc(clientDb, COLLECTION, id);
    await deleteDoc(docRef);
  } catch (err) {
    console.error('Error deleting from Firestore:', err);
  }

  await mutateLocalProducts((products) => {
    const index = products.findIndex((product) => product.id === id);
    if (index >= 0) products.splice(index, 1);
    return { value: true };
  }).catch(() => {});

  return true;
}

export async function seedProducts(seedItems) {
  const now = Date.now();
  const productsToSeed = seedItems.map((item) => ({
    ...item,
    createdAt: item.createdAt || now,
    updatedAt: now,
  }));

  try {
    await Promise.all(
      productsToSeed.map((product) =>
        setDoc(doc(clientDb, COLLECTION, product.id), product, { merge: true })
      )
    );
  } catch (err) {
    console.error('Error seeding to Firestore:', err);
  }

  await mutateLocalProducts((products) => {
    for (const seededProduct of productsToSeed) {
      const index = products.findIndex((product) => product.id === seededProduct.id);
      if (index < 0) {
        products.push(seededProduct);
      } else {
        products[index] = { ...products[index], ...seededProduct, createdAt: products[index].createdAt };
      }
    }
    return { value: productsToSeed.length };
  }).catch(() => {});

  return productsToSeed.length;
}
