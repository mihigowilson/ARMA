import { db } from './firebase';
import { collection, doc, setDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { NewsletterSubscriber } from '../types/arma';

const SUBSCRIBERS_COLLECTION = 'subscribers';

export const subscribeToNewsletterStore = (
  callback: (subscribers: NewsletterSubscriber[]) => void
) => {
  try {
    const colRef = collection(db, SUBSCRIBERS_COLLECTION);
    return onSnapshot(
      colRef,
      (snapshot) => {
        const items: NewsletterSubscriber[] = [];
        snapshot.forEach((docSnap) => {
          items.push({ id: docSnap.id, ...docSnap.data() } as NewsletterSubscriber);
        });
        if (items.length > 0) {
          callback(items);
        }
      },
      (error) => {
        console.warn('Firestore subscription fallback:', error.message);
      }
    );
  } catch (err) {
    console.warn('Firestore initialization error:', err);
    return () => {};
  }
};

export const saveSubscriberToFirestore = async (subscriber: NewsletterSubscriber) => {
  try {
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, subscriber.id);
    await setDoc(docRef, subscriber, { merge: true });
  } catch (err) {
    console.warn('Failed to save subscriber to Firestore (local state active):', err);
  }
};

export const deleteSubscriberFromFirestore = async (subscriberId: string) => {
  try {
    const docRef = doc(db, SUBSCRIBERS_COLLECTION, subscriberId);
    await deleteDoc(docRef);
  } catch (err) {
    console.warn('Failed to delete subscriber from Firestore:', err);
  }
};
