import "firebase/auth";
import firebase from "firebase/app";
import firebaseConfig from "./firebaseConfig.json";

let _app: firebase.app.App | null = null;

function getApp() {
  if (_app) return _app;
  if (firebase.apps.length > 0) {
    return (_app = firebase.app());
  } else {
    _app = firebase.initializeApp(firebaseConfig);
    return _app;
  }
}

export function getAuth() {
  return getApp().auth();
}

export async function loginWithTwitter() {
  const provider = new firebase.auth.TwitterAuthProvider();
  try {
    const user = await firebase.auth().signInWithPopup(provider);
    console.log(user);
  } catch (error) {
    console.error("login failed", error);
  }
}

// @ts-ignore
globalThis._app = firebase;
export async function logout() {
  try {
    const user = await firebase.auth().signOut();
    console.log(user);
  } catch (error) {
    console.error("logout failed", error);
  }
}
