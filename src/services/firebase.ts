import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyDjwUyr4Qiynb8y3D4ZceidlSrDVgbrj7Q",
    authDomain: "self-studytracker.firebaseapp.com",
    projectId: "self-studytracker",
    storageBucket: "self-studytracker.firebasestorage.app",
    messagingSenderId: "544957082646",
    appId: "1:544957082646:web:f2b9dfa4595bde00155937",
    measurementId: "G-Z08Q316JCJ"
};

import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";

// ... imports

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = initializeFirestore(app, {
    localCache: persistentLocalCache({
        tabManager: persistentMultipleTabManager()
    })
});
export const storage = getStorage(app);
export const analytics = getAnalytics(app);
