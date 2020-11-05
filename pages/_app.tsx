import React from "react"
import Head from "next/head"
import { AppProps } from "next/app"
import { ThemeProvider } from "@material-ui/core/styles"
import CssBaseline from "@material-ui/core/CssBaseline"
import theme from "~/lib/theme"
import { useAuthState } from "~/lib/auth"
import Container from "@material-ui/core/Container"
import Typography from "@material-ui/core/Typography"
import Box from "@material-ui/core/Box"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import Link from "~/components/atoms/Link"
import { loginWithTwitter, logout } from "~/lib/firebase"

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

        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </React.Fragment>
  )
}

function Layout({ children }: { children: React.ReactChild }) {
  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom>
          EmoSearch
        </Typography>

        <AuthContainer>{children}</AuthContainer>
      </Box>
    </Container>
  )
}

function AuthContainer({ children }: { children: React.ReactChild }) {
  const [user, isLoading] = useAuthState()

  if (isLoading) {
    return <CircularProgress />
  }

  if (!user) {
    return (
      <Button onClick={() => loginWithTwitter()}>Login with Twitter</Button>
    )
  }

  return (
    <React.Fragment>
      <div>Hello {user.displayName}</div>
      <Button onClick={() => logout()}>Logout</Button>
      {children}
    </React.Fragment>
  )
}
