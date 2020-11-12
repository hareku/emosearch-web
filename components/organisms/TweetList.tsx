import React from "react"
import { formatDistanceToNow } from "date-fns"
import {
  Box,
  Avatar,
  CircularProgress,
  Typography,
  SvgIcon,
  colors,
} from "@material-ui/core"
import Link from "~/components/atoms/Link"
import { Tweet } from "~/types/tweet"
import InfiniteScroll from "react-infinite-scroller"
import {
  SentimentDissatisfied,
  SentimentSatisfied,
  SentimentVerySatisfied,
} from "@material-ui/icons"
import { linkTweet } from "~/lib/link-tweet"

interface Data {
  HasMore: boolean
  Tweets: Tweet[]
}

export default function TweetList({
  data,
  loading,
  onLoadTweets,
}: {
  data: Data
  loading: boolean
  onLoadTweets: () => void
}) {
  return (
    <InfiniteScroll
      loadMore={onLoadTweets}
      hasMore={!loading && data.HasMore}
      loader={<Loader key={0} />}
      threshold={1600}
    >
      <TweetListBody data={data} />
    </InfiniteScroll>
  )
}

function TweetListBody({ data }: { data: Data }) {
  if (data.Tweets.length === 0) {
    return data.HasMore ? null : <div>No Tweets.</div>
  }

  return (
    <Box border={1} borderColor="grey.100">
      {data.Tweets.map((tweet) => (
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

function Loader() {
  return (
    <Box textAlign="center" mt={3}>
      <CircularProgress />
    </Box>
  )
}

function TweetCard({ tweet }: { tweet: Tweet }) {
  const linkedTweet = React.useMemo(
    () => linkTweet(tweet.Text, tweet.Entities),
    [tweet]
  )

  return (
    <Box pt={1} pb={3} px={2} display="flex">
      <Box mr={2}>
        <Avatar
          variant="rounded"
          alt={tweet.User.Name}
          src={tweet.User.ProfileImageURL}
          style={{
            width: 48,
            height: 48,
            border: `1px solid ${colors.grey[100]}`,
          }}
        />
      </Box>
      <Box flexGrow={1} minWidth={0}>
        <Box display="flex" alignItems="center">
          <Link
            href={`http://twitter.com/${tweet.User.ScreenName}`}
            target="_blank"
            title={tweet.User.Name}
            style={{ marginRight: 5 }}
          >
            <Typography
              color="textSecondary"
              variant="caption"
              component="span"
            >
              {tweet.User.Name}
            </Typography>
          </Link>
          <Link
            href={`http://twitter.com/${tweet.User.ScreenName}/status/${tweet.TweetID}`}
            target="_blank"
            title={tweet.TweetCreatedAt}
          >
            <Typography color="textSecondary" variant="caption">
              ({formatDistanceToNow(Date.parse(tweet.TweetCreatedAt))})
            </Typography>
          </Link>
          {tweet.SentimentScore ? (
            <div style={{ marginLeft: "auto" }}>
              {tweet.SentimentLabel === "POSITIVE" ? (
                <SvgIcon color="primary">
                  <SentimentVerySatisfied />
                </SvgIcon>
              ) : tweet.SentimentLabel === "POSITIVE" ? (
                <SvgIcon color="secondary">
                  <SentimentDissatisfied />
                </SvgIcon>
              ) : (
                <SvgIcon color="disabled">
                  <SentimentSatisfied />
                </SvgIcon>
              )}
            </div>
          ) : null}
        </Box>
        <Box mt={1}>
          <Typography
            style={{ wordWrap: "break-word", whiteSpace: "pre-wrap" }}
            dangerouslySetInnerHTML={{ __html: linkedTweet }}
          ></Typography>

          {tweet.SentimentScore ? (
            <Typography
              style={{
                wordWrap: "break-word",
                whiteSpace: "pre-wrap",
                marginTop: 4,
              }}
              color="textSecondary"
            >
              Positive:{" "}
              {Math.round(tweet.SentimentScore.Positive * 1000) / 1000}
              <br />
              Negative:{" "}
              {Math.round(tweet.SentimentScore.Negative * 1000) / 1000}
              <br />
              Mixed: {Math.round(tweet.SentimentScore.Mixed * 1000) / 1000}
              <br />
              Neutral: {Math.round(tweet.SentimentScore.Neutral * 1000) / 1000}
            </Typography>
          ) : null}
          {tweet.Entities?.Media.map((medium, ind) => (
            <Box mt={1} key={ind}>
              {medium.VideoURL ? (
                <video
                  src={medium.VideoURL}
                  autoPlay={false}
                  style={{ maxWidth: "100%", height: "auto" }}
                  controls
                />
              ) : (
                <img
                  src={medium.MediaURL}
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
