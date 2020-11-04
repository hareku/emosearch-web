import { GetServerSideProps } from "next";
import { useAuthState } from "react-firebase-hooks/auth";
import { loginWithTwitter, getAuth, logout } from "~/lib/firebase";

type Props = {};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
  return {
    props: {},
  };
};

const Index = () => {
  const [user, loading] = useAuthState(getAuth());
  return (
    <main>
      {!loading && user ? (
        <>
          <button onClick={() => logout()}>Logout</button>
          <div>Hello {JSON.stringify(user)}</div>
        </>
      ) : (
        <button onClick={() => loginWithTwitter()}>Login</button>
      )}
    </main>
  );
};

export default Index
