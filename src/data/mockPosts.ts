import { collection, doc, getDocs, getDoc, setDoc, deleteDoc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db, auth } from '../lib/firebase';
import { BlogPost } from '../types';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: any;
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export const initialPosts = []; // Can be removed later if not used in components currently

export const getPosts = async (): Promise<BlogPost[]> => {
  const pathForGetDocs = 'posts';
  try {
    const q = query(collection(db, pathForGetDocs), orderBy('date', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    })) as BlogPost[];
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, pathForGetDocs);
    return [];
  }
};

export const getPost = async (id: string): Promise<BlogPost | undefined> => {
  const pathForGetDocs = `posts/${id}`;
  try {
    const docRef = doc(db, 'posts', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { ...docSnap.data(), id: docSnap.id } as BlogPost;
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, pathForGetDocs);
  }
  return undefined;
};

const removeUndefined = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map(removeUndefined);
  } else if (obj !== null && typeof obj === 'object') {
    const newObj: any = {};
    for (const key in obj) {
      if (obj[key] !== undefined) {
        newObj[key] = removeUndefined(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
};

export const savePost = async (post: BlogPost) => {
  const pathForWrite = `posts/${post.id}`;
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Must be logged in to create post");

    // Add required metadata
    const dataToSave = removeUndefined({
      ...post,
      ownerId: currentUser.uid,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // We shouldn't duplicate id in firestore if it's the doc key, but for interface matching it's ok
    const docRef = doc(db, 'posts', post.id);
    await setDoc(docRef, dataToSave);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, pathForWrite);
  }
};

export const updatePost = async (id: string, updatedData: Partial<BlogPost>) => {
  const pathForWrite = `posts/${id}`;
  try {
    const docRef = doc(db, 'posts', id);
    const dataToUpdate = removeUndefined({ ...updatedData, updatedAt: Date.now() });
    await updateDoc(docRef, dataToUpdate);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, pathForWrite);
  }
};

