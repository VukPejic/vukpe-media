import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

import { Videos, ChannelCard } from './';
import PlaylistCard from './PlaylistCard'; // New component to show playlists
import { fetchFromAPI } from '../utils/fetchFromAPI';

const ChannelDetail = () => {
  const [channelDetail, setChannelDetail] = useState(null);
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const { id } = useParams();

  useEffect(() => {
    // Include brandingSettings to get banner URL
    fetchFromAPI(`channels?part=snippet,brandingSettings&id=${id}`)
      .then((data) => setChannelDetail(data?.items[0]));

    fetchFromAPI(`search?channelId=${id}&part=snippet&order=date`)
      .then((data) => setVideos(data?.items));

    fetchFromAPI(`playlists?part=snippet,contentDetails&channelId=${id}&maxResults=20`)
      .then((data) => setPlaylists(data?.items));
  }, [id]);

  return (
    <Box minHeight="95vh" bgcolor="#000">
      <Box>
        {/* Show banner image if available, otherwise show fallback gradient */}
        {channelDetail?.brandingSettings?.image?.bannerExternalUrl ? (
          <Box
            component="img"
            src={channelDetail.brandingSettings.image.bannerExternalUrl}
            alt="channel banner"
            sx={{
              width: '100%',
              maxHeight: { xs: '150px', md: '300px' },
              objectFit: 'cover',
              mb: 2,
              borderRadius: 1,
            }}
          />
        ) : (
          <div
            style={{
              background:
                'linear-gradient(90deg, rgba(0,238,247,1) 0%, rgba(206,3,184,1) 100%, rgba(0,212,255,1) 100%)',
              zIndex: 10,
              height: '300px',
              marginBottom: 16, // match mb:2 spacing
              borderRadius: 8,
            }}
          />
        )}

        <ChannelCard channelDetail={channelDetail} marginTop="-110px" />
      </Box>

      <Box display="flex" p="2" flexDirection="column" gap={4}>
        {/* Videos Section */}
        <Box>
          <Typography variant="h5" color="white" mb={2}>
            Videos
          </Typography>
          <Videos videos={videos} />
        </Box>

        {/* Playlists Section */}
        <Box>
          <Typography variant="h5" color="white" mb={2}>
            Playlists
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            {playlists.length > 0 ? (
              playlists.map((playlist) => (
                <PlaylistCard key={playlist.id} playlist={playlist} />
              ))
            ) : (
              <Typography color="gray">No playlists found.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default ChannelDetail;
