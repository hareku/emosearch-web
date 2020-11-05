import "firebase/auth"
import firebase from "firebase/app"
import firebaseConfig from "./firebaseConfig.json"

let _app: firebase.app.App | null = null

function getApp() {
  if (_app) return _app
  if (firebase.apps.length > 0) {
    return (_app = firebase.app())
  } else {
    _app = firebase.initializeApp(firebaseConfig)
    return _app
  }
}

export function getAuth() {
  return getApp().auth()
}

export function loginWithTwitter() {
  const provider = new firebase.auth.TwitterAuthProvider()
  return firebase.auth().signInWithPopup(provider)
}

export async function logout() {
  return firebase.auth().signOut()
}
