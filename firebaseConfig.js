import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyA2NKhDBXQM7kCNDNq5bxnGSc-anhg0Q1I",
  authDomain: "geekyants-hrms.firebaseapp.com",
  projectId: "geekyants-hrms",
  storageBucket: "geekyants-hrms.appspot.com",
  messagingSenderId: "307956149688",
  appId: "1:307956149688:web:f534dc4f8b77d3bbfe734d"
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export default auth;
//IOS: 1012261498431-6tvlt16np1lgh3uv86upe7ecb9dr14eb.apps.googleusercontent.com
//Android: 1012261498431-qqk223d0e9vqdv9du8r5pdk60aqfi767.apps.googleusercontent.com
