import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Box, Typography, Stack, Divider } from '@mui/material';

import { fetchFromAPI } from '../utils/fetchFromAPI';

const PlaylistDetail = () => {
  const { id } = useParams();
  const [videos, setVideos] = useState([]);
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    // Fetch playlist details
    fetchFromAPI(`playlists?part=snippet,contentDetails&id=${id}`)
      .then((data) => setPlaylist(data?.items?.[0] || null))
      .catch(() => setPlaylist(null));

    // Fetch playlist videos
    fetchFromAPI(`playlistItems?part=snippet,contentDetails&playlistId=${id}&maxResults=50`)
      .then((data) => setVideos(data?.items || []))
      .catch(() => setVideos([]));
  }, [id]);

  return (
    <Box sx={{ minHeight: '95vh', backgroundColor: '#0f0f0f', color: 'white', p: 2 }}>
      {/* Playlist Header */}
      {playlist && (
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center" mb={3}>
          <Box
            component="img"
            src={playlist.snippet?.thumbnails?.high?.url || ''}
            alt={playlist.snippet?.title || ''}
            sx={{
              width: { xs: '100%', md: 320 },
              height: 180,
              borderRadius: 2,
              boxShadow: '0 0 15px rgba(252, 21, 3, 0.7)',
            }}
          />
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              {playlist.snippet?.title || 'No Title'}
            </Typography>
            <Typography variant="subtitle1" color="gray" gutterBottom>
              <Link to={`/channel/${playlist.snippet?.channelId}`} style={{ color: '#FC1503', textDecoration: 'none' }}>
                {playlist.snippet?.channelTitle || 'Unknown Channel'}
              </Link>
            </Typography>
            <Typography variant="body2" color="gray">
              {playlist.contentDetails?.itemCount || 0} videos
            </Typography>
          </Box>
        </Stack>
      )}

      <Divider sx={{ borderColor: '#333', mb: 2 }} />

      {/* Playlist Videos List */}
      <Stack spacing={1}>
        {Array.isArray(videos) && videos.length > 0 ? (
          videos.map((item, idx) => {
            const videoId = item.snippet?.resourceId?.videoId;
            const { title, thumbnails, publishedAt } = item.snippet || {};

            if (!videoId) return null; // skip invalid entries

            return (
              <Link
                key={idx}
                to={`/video/${videoId}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '16px',
                  padding: '10px 8px',
                  backgroundColor: '#181818',
                  borderRadius: 4,
                  textDecoration: 'none',
                  color: 'white',
                  transition: 'background-color 0.3s',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#252525')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#181818')}
              >
                <Box
                  component="img"
                  src={thumbnails?.medium?.url || ''}
                  alt={title || ''}
                  sx={{ width: 168, height: 94, borderRadius: 4, flexShrink: 0 }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold" noWrap>
                    {title || 'Untitled'}
                  </Typography>
                  <Typography variant="body2" color="gray" noWrap>
                    {publishedAt ? new Date(publishedAt).toLocaleDateString() : ''}
                  </Typography>
                </Box>
              </Link>
            );
          })
        ) : (
          <Typography color="gray">No videos found in this playlist.</Typography>
        )}
      </Stack>
    </Box>
  );
};

export default PlaylistDetail;
