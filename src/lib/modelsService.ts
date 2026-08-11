import { db, auth } from './firebase';
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  getDocs,
  onSnapshot
} from 'firebase/firestore';
import { ModelProfile, AgencyProfile } from '../types/arma';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const MODELS_COLLECTION = 'models';
const AGENCIES_COLLECTION = 'agencies';

/**
 * Subscribe to Models in Firestore real-time.
 */
export const subscribeToModelsStore = (
  callback: (models: ModelProfile[]) => void
) => {
  try {
    const colRef = collection(db, MODELS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: ModelProfile[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as ModelProfile);
        });
        if (items.length > 0) {
          callback(items);
        }
      },
      (error) => {
        console.warn('Firestore models subscription notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore initialization error for models:', err);
    return () => {};
  }
};

/**
 * Subscribe to Agencies in Firestore real-time.
 */
export const subscribeToAgenciesStore = (
  callback: (agencies: AgencyProfile[]) => void
) => {
  try {
    const colRef = collection(db, AGENCIES_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: AgencyProfile[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as AgencyProfile);
        });
        if (items.length > 0) {
          callback(items);
        }
      },
      (error) => {
        console.warn('Firestore agencies subscription notice:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore initialization error for agencies:', err);
    return () => {};
  }
};

/**
 * Save or sync a model document to Firestore.
 */
export const saveModelToFirestore = async (model: ModelProfile) => {
  const path = `${MODELS_COLLECTION}/${model.id}`;
  try {
    const docRef = doc(db, MODELS_COLLECTION, model.id);
    await setDoc(docRef, model, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Save or sync an agency document to Firestore.
 */
export const saveAgencyToFirestore = async (agency: AgencyProfile) => {
  const path = `${AGENCIES_COLLECTION}/${agency.id}`;
  try {
    const docRef = doc(db, AGENCIES_COLLECTION, agency.id);
    await setDoc(docRef, agency, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

/**
 * Firestore Relationship Logic:
 * Associate a model with an agency in Firestore.
 * Updates model's agencyId & agencyName and increments agency's representedModelsCount.
 */
export const associateModelWithAgencyInFirestore = async (
  modelId: string,
  agencyId: string,
  agencyName: string,
  currentAgencyModelsCount: number
) => {
  const modelPath = `${MODELS_COLLECTION}/${modelId}`;
  const agencyPath = `${AGENCIES_COLLECTION}/${agencyId}`;

  try {
    // 1. Update model profile in Firestore
    const modelRef = doc(db, MODELS_COLLECTION, modelId);
    await updateDoc(modelRef, {
      agencyId,
      agencyName
    });

    // 2. Update agency document count
    const agencyRef = doc(db, AGENCIES_COLLECTION, agencyId);
    await updateDoc(agencyRef, {
      representedModelsCount: currentAgencyModelsCount + 1
    });
  } catch (error) {
    console.warn('Failed to persist model-agency relationship in Firestore:', error);
  }
};

/**
 * Firestore Relationship Logic:
 * Remove a model from an agency in Firestore.
 * Clears model's agencyId & agencyName and decrements agency's representedModelsCount.
 */
export const disassociateModelFromAgencyInFirestore = async (
  modelId: string,
  agencyId: string,
  currentAgencyModelsCount: number
) => {
  try {
    // 1. Clear model's agency association in Firestore
    const modelRef = doc(db, MODELS_COLLECTION, modelId);
    await updateDoc(modelRef, {
      agencyId: null,
      agencyName: null
    });

    // 2. Decrement agency document count
    if (agencyId) {
      const agencyRef = doc(db, AGENCIES_COLLECTION, agencyId);
      await updateDoc(agencyRef, {
        representedModelsCount: Math.max(0, currentAgencyModelsCount - 1)
      });
    }
  } catch (error) {
    console.warn('Failed to remove model-agency relationship in Firestore:', error);
  }
};

/**
 * Initialize Firestore data if empty (seeds initial directory data to Firestore).
 */
export const seedInitialDirectoryData = async (
  initialModels: ModelProfile[],
  initialAgencies: AgencyProfile[]
) => {
  try {
    if (initialModels && initialModels.length > 0) {
      const modelsSnap = await getDocs(collection(db, MODELS_COLLECTION));
      if (modelsSnap.empty) {
        for (const m of initialModels) {
          await setDoc(doc(db, MODELS_COLLECTION, m.id), m);
        }
      }
    }

    if (initialAgencies && initialAgencies.length > 0) {
      const agenciesSnap = await getDocs(collection(db, AGENCIES_COLLECTION));
      if (agenciesSnap.empty) {
        for (const a of initialAgencies) {
          await setDoc(doc(db, AGENCIES_COLLECTION, a.id), a);
        }
      }
    }
  } catch (err) {
    console.warn('Directory seeding notice:', err);
  }
};
