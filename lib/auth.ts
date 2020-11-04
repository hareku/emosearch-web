import { useAuthState as useAuthStateHook } from "react-firebase-hooks/auth"
import { getAuth } from "~/lib/firebase"
import firebase from "firebase/app"

export function useAuthState(): [
  firebase.User | undefined,
  boolean,
  firebase.auth.Error | undefined
] {
  return useAuthStateHook(getAuth())
}
