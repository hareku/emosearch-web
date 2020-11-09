import React from "react"
import { formatDistance } from "date-fns"
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
    <Box border={1} borderColor="grey.100">
      {data.map((tweet) => (
        <Box
          key={tweet.TweetID}
          border={1}
          borderTop={0}
          borderLeft={0}
          borderRight={0}
          borderColor="grey.100"
        >
          <TweetCard tweet={tweet} />
        </Box>
      ))}
    </Box>
  )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  return (
    <Box p={2}>
      <div>{tweet.Text}</div>
      <div style={{ textAlign: "right", marginTop: 5 }}>
        <Link
          href={`http://twitter.com/intent/retweet?tweet_id=${tweet.TweetID}`}
          target="_blank"
          title={tweet.TweetCreatedAt}
        >
          {formatDistance(Date.parse(tweet.TweetCreatedAt), new Date())}
        </Link>
      </div>
    </Box>
  )
}
