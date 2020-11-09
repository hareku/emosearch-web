import React from "react"
import Card from "@material-ui/core/Card"
import CardContent from "@material-ui/core/CardContent"
import Box from "@material-ui/core/Box"
import useFetch from "use-http"
import Link from "~/components/atoms/Link"
import { Tweet } from "~/types/tweet"
import { useRouter } from "next/router"

export default function TweetList() {
  const router = useRouter()
  const { get, loading, error, data = [] } = useFetch<Tweet[]>(
    `/searches/${router.query.sid}/tweets?limit=100`
  )
  React.useEffect(() => {
    get().catch()
  }, [])

  if (loading) {
    return <div>loading tweetes</div>
  }

  if (error) {
    return <div>{error.message}</div>
  }

  return (
    <React.Fragment>
      {data.map((tweet) => (
        <Box key={tweet.TweetID} mb={1}>
          <TweetCard tweet={tweet} />
        </Box>
      ))}
    </React.Fragment>
  )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <Card>
      <CardContent>
        <div>{tweet.Text}</div>
        <div style={{ textAlign: "right", marginTop: 5 }}>
          <Link
            href={`http://twitter.com/intent/retweet?tweet_id=${tweet.TweetID}`}
            target="_blank"
          >
            {tweet.TweetCreatedAt}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
