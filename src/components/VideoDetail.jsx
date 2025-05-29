import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import ReactPlayer from 'react-player';
import {
  Typography,
  Box,
  Stack,
  Avatar,
  Button,
  IconButton,
  Tooltip,
  Divider,
} from '@mui/material';
import {
  CheckCircle,
  ThumbUpAltOutlined,
} from '@mui/icons-material';

import { Videos } from './';
import { fetchFromAPI } from '../utils/fetchFromAPI';

// Utility to show time since published (e.g. "2 days ago")
function timeSince(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);
  let interval = seconds / 31536000;

  if (interval > 1) return Math.floor(interval) + ' years ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + ' months ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + ' days ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + ' hours ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + ' minutes ago';
  return 'Just now';
}

const VideoDetail = () => {
  const [videoDetail, setVideoDetail] = useState(null);
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentCount, setCommentCount] = useState(0);
  const { id } = useParams();

  useEffect(() => {
    // Fetch video details
    fetchFromAPI(`videos?part=snippet,statistics&id=${id}`).then((data) => {
      setVideoDetail(data.items[0]);
      setCommentCount(data.items[0]?.statistics?.commentCount || 0);

      const channelId = data.items[0]?.snippet?.channelId;
      if (channelId) {
        fetchFromAPI(`channels?part=snippet&id=${channelId}`).then((channelData) => {
          setChannelDetail(channelData.items[0]);
        });
      }
    });

    // Fetch related videos
    fetchFromAPI(`search?part=snippet&relatedToVideoId=${id}&type=video`).then(
      (data) => setVideos(data.items)
    );

    // Fetch comments
    fetchFromAPI(
      `commentThreads?part=snippet&videoId=${id}&maxResults=20&order=relevance`
    ).then((data) => {
      setComments(data.items || []);
    });
  }, [id]);

  if (!videoDetail?.snippet) return 'Loading...';

  const {
    snippet: { title, channelId, channelTitle },
    statistics: { viewCount, likeCount },
  } = videoDetail;

  return (
    <Box minHeight="95vh" sx={{ bgcolor: '#0f0f0f', color: 'white', p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }}>
        {/* Video Player */}
        <Box flex={1}>
          <Box sx={{ width: '100%', position: 'sticky', top: '86px' }}>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${id}`}
              className="react-player"
              controls
              width="100%"
              height="60vh"
              playing
            />
            <Typography color="#FFF" variant="h5" fontWeight="bold" p={2}>
              {title}
            </Typography>

            {/* Enhanced Channel Section */}
            {channelDetail && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between"
                sx={{
                  color: '#FFF',
                  px: 2,
                  py: 2,
                  borderRadius: 2,
                  backgroundColor: '#181818',
                  flexWrap: 'wrap',
                  gap: 2,
                }}
              >
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none' }}>
                    <Avatar
                      src={channelDetail.snippet?.thumbnails?.default?.url}
                      alt={channelTitle}
                      sx={{ width: 48, height: 48 }}
                    />
                  </Link>

                  <Box>
                    <Link to={`/channel/${channelId}`} style={{ textDecoration: 'none', color: 'white' }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
                      >
                        {channelTitle}
                        <CheckCircle sx={{ fontSize: 14, color: 'gray' }} />
                      </Typography>
                    </Link>
                    <Typography variant="body2" color="gray">
                      {parseInt(viewCount).toLocaleString()} views • {parseInt(likeCount).toLocaleString()} likes
                    </Typography>
                  </Box>
                </Stack>

                <Button
                  variant="contained"
                  color="error"
                  sx={{ textTransform: 'none', fontWeight: 'bold' }}
                >
                  Subscribe
                </Button>
              </Stack>
            )}
          </Box>
        </Box>

        {/* Related Videos */}
        <Box
          px={2}
          py={{ md: 1, xs: 5 }}
          justifyContent="center"
          alignItems="center"
          maxWidth={{ xs: '100%', md: 360 }}
          flexShrink={0}
        >
          <Videos videos={videos} direction="column" />
        </Box>
      </Stack>

      {/* Comments Section */}
      <Divider sx={{ my: 3, borderColor: '#444' }} />
      <Typography
        variant="h6"
        fontWeight="bold"
        mb={2}
        sx={{ pl: { xs: 0, md: 4 }, color: 'white' }}
      >
        Comments ({commentCount ? parseInt(commentCount).toLocaleString() : comments.length})
      </Typography>

      {comments.length === 0 && (
        <Typography color="gray" mb={2} sx={{ pl: { xs: 0, md: 4 } }}>
          No comments found.
        </Typography>
      )}

      {comments.map(({ id: commentId, snippet }) => {
        const comment = snippet.topLevelComment.snippet;
        return (
          <Box
            key={commentId}
            sx={{
              display: 'flex',
              mb: 3,
              pl: { xs: 0, md: 4 },
            }}
          >
            <Avatar
              alt={comment.authorDisplayName}
              src={comment.authorProfileImageUrl}
              sx={{ width: 40, height: 40, mr: 2 }}
            />
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography variant="subtitle2" fontWeight="bold" sx={{ color: 'white' }}>
                  {comment.authorDisplayName}
                </Typography>
                <CheckCircle sx={{ fontSize: 14, color: 'gray' }} />
                <Typography variant="caption" color="gray">
                  {timeSince(comment.publishedAt)}
                </Typography>
              </Stack>
              <Typography
                variant="body2"
                sx={{ mt: 0.5, whiteSpace: 'pre-line', color: 'white' }}
                dangerouslySetInnerHTML={{ __html: comment.textDisplay }}
              />
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mt: 1 }}>
                <Tooltip title="Like">
                  <IconButton size="small" sx={{ color: 'gray' }}>
                    <ThumbUpAltOutlined fontSize="small" />
                  </IconButton>
                </Tooltip>
                {comment.likeCount > 0 && (
                  <Typography variant="caption" sx={{ color: 'gray' }}>
                    {comment.likeCount}
                  </Typography>
                )}
              </Stack>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
};

export default VideoDetail;
