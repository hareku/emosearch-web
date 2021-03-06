import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import theme from "~/lib/theme"
import { useAuthState, useLogin } from "~/lib/hooks/auth"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Link from "~/components/Link"
import { logout, getAuth } from "~/lib/firebase"
import { Provider as UseHttpProvider, IncomingOptions } from "use-http"
import { useRouter } from "next/router"

const FetchOptions: IncomingOptions = {
  interceptors: {
    request: async ({ options }) => {
      const auth = getAuth()
      if (auth && auth.currentUser) {
        try {
          const token = await auth.currentUser.getIdToken(true)
          if (!(options.headers instanceof Headers)) {
            options.headers = new Headers()
            options.headers.set("Authorization", `Bearer ${token}`)
          }
        } catch (_) {
          // do nothing
        }
      }

      return options
    },
  },
}

export default function MyApp(props: AppProps) {
  const { Component, pageProps } = props

  React.useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side")
    if (jssStyles) {
      jssStyles.parentElement!.removeChild(jssStyles)
    }
  }, [])

  return (
    <React.Fragment>
      <Head>
        <title>EmoSearch</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />

        <UseHttpProvider
          url={process.env.NEXT_PUBLIC_API_ENDPOINT}
          options={FetchOptions}
        >
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </UseHttpProvider>
      </ThemeProvider>
    </React.Fragment>
  )
}

function Layout({ children }: { children: React.ReactChild }) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Box textAlign="center">
          <Typography
            variant="h4"
            component="h1"
            gutterBottom
            color="textPrimary"
          >
            <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
              EmoSearch
            </Link>
          </Typography>
        </Box>

        <AuthContainer>{children}</AuthContainer>
      </Box>
    </Container>
  )
}

function AuthContainer({ children }: { children: React.ReactChild }) {
  const [user, isLoading] = useAuthState()
  const { handleLogin } = useLogin()
  const router = useRouter()

  const handleLogoutLink = React.useCallback(
    (event: React.SyntheticEvent) => {
      event.preventDefault()
      logout()
        .then(() => {
          router.replace("/")
        })
        .catch(() => {
          window.alert("Logout failed")
        })
    },
    [router]
  )

  if (isLoading) {
    return (
      <Box p={1} textAlign="center">
        <CircularProgress />
      </Box>
    )
  }

  if (!user) {
    return <Button onClick={handleLogin}>Login with Twitter</Button>
  }

  return (
    <React.Fragment>
      <Box mb={3} textAlign="center">
        Hello {user.displayName}.{" "}
        <Link href="/logout" onClick={handleLogoutLink}>
          Logout
        </Link>
      </Box>

      {children}
    </React.Fragment>
  )
}
