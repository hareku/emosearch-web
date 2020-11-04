import { useAuthState } from "~/lib/auth"
import { loginWithTwitter, logout } from "~/lib/firebase"

const Index = () => {
  const [user, loading] = useAuthState()
  return (
    <main>
      {!loading && user ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <div>Hello {user.displayName}</div>
        </>
      ) : (
        <button onClick={() => loginWithTwitter()}>Login</button>
      )}
    </main>
  )
}

export default Index
