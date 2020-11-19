import React from "react"
import firebase from "firebase/app"
import { useAuthState as useFirebaseAuthState } from "react-firebase-hooks/auth"
import { loginWithTwitter, getAuth, logout } from "~/lib/firebase"
import useFetch from "use-http"

export function useAuthState(): [firebase.User | undefined, boolean] {
  const [user, loading] = useFirebaseAuthState(getAuth())
  return [user, loading]
}

export function useLogin() {
  const { post: register } = useFetch("/users/@me")

  const handleLogin = React.useCallback(() => {
    loginWithTwitter()
      .then((result) => {
        return register({
          // @ts-ignore: firebase does not have credential type for twitter provider
          TwitterAccessToken: result.credential.accessToken,
          // @ts-ignore: firebase does not have credential type for twitter provider
          TwitterAccessTokenSecret: result.credential.secret,
        })
      })
      .catch(() => {
        logout()
        window.alert("Login failed")
      })
  }, [register])

  return { handleLogin }
}
