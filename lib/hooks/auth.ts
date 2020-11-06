import React from "react"
import firebase from "firebase/app"
import { useAuthState as useFirebaseAuthState } from "react-firebase-hooks/auth"
import { loginWithTwitter, getAuth, logout } from "~/lib/firebase"
import useFetch from "use-http"

export function useAuthState(): [firebase.User | undefined, boolean] {
  const [user, loading] = useFirebaseAuthState(getAuth())

  // TODO: check whether user is resigstered
  // const { get: verifyRegistration } = useFetch("/users/@me")
  // React.useEffect(() => {
  //   if(!loading && user) {
  //     verifyRegistration().catch(() => logout())
  //   }
  // }, [loading, user])

  return [user, loading]
}

export function useLogin() {
  const { post: register } = useFetch("/users/@me")

  const handleLogin = React.useCallback(() => {
    loginWithTwitter()
      .then((result) => {
        return register({
          // @ts-ignore: firebase does not have credential type for twitter
          twitter_access_token: result.credential.accessToken,
          // @ts-ignore: firebase does not have credential type for twitter
          twitter_access_token_secret: result.credential.secret,
        })
      })
      .catch(() => {
        window.alert("Login failed")
      })
  }, [register])

  return { handleLogin }
}
