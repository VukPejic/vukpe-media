import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

const PlaylistCard = ({ playlist }) => {
  const playlistId = playlist.id?.playlistId || playlist.id; // playlist.id could be string or object
  const snippet = playlist.snippet || {};
  const contentDetails = playlist.contentDetails || {};

  return (
    <Card
      sx={{
        width: 320,
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        borderRadius: 3,
        bgcolor: '#121212',
        transition: 'transform 0.3s',
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 8px 16px rgba(252, 21, 3, 0.7)',
        },
        cursor: 'pointer',
      }}
    >
      <Link to={`/playlist/${playlistId}`} style={{ textDecoration: 'none' }}>
        <CardMedia
          component="img"
          image={snippet.thumbnails?.high?.url || ''}
          alt={snippet.title || 'Playlist thumbnail'}
          sx={{ height: 180, borderTopLeftRadius: 12, borderTopRightRadius: 12 }}
        />
        <CardContent sx={{ p: 2 }}>
          <Typography
            variant="h6"
            fontWeight="bold"
            color="#FC1503"
            gutterBottom
            noWrap
          >
            {snippet.title || 'No Title'}
          </Typography>
          <Typography variant="body2" color="gray" noWrap>
            {snippet.channelTitle || 'Unknown Channel'}
          </Typography>
          {contentDetails.itemCount !== undefined && (
            <Box mt={1}>
              <Typography variant="caption" color="gray">
                {contentDetails.itemCount} videos
              </Typography>
            </Box>
          )}
        </CardContent>
      </Link>
    </Card>
  );
};

export default PlaylistCard;
