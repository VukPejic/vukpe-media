import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

import { fetchFromAPI } from '../utils/fetchFromAPI';
import Videos from './Videos';
import PlaylistCard from './PlaylistCard';

const SearchFeed = () => {
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const { searchTerm } = useParams();

  useEffect(() => {
    // Fetch videos
    fetchFromAPI(`search?part=snippet&q=${searchTerm}&type=video&maxResults=25`)
      .then((data) => setVideos(data?.items ?? []));

    // Fetch playlists
    fetchFromAPI(`search?part=snippet&q=${searchTerm}&type=playlist&maxResults=25`)
      .then((data) => setPlaylists(data?.items ?? []));
  }, [searchTerm]);

  return (
    <Box p={2} sx={{ overflowY: 'auto', height: '90vh', flex: 2 }}>
      <Typography variant='h4' fontWeight="bold" mb={2} sx={{ color: 'white' }}>
        Search Results for: <span style={{ color: '#FC1503' }}>{searchTerm}</span>
      </Typography>

      {/* Videos Section */}
      <Typography variant="h5" color="white" mb={1}>Videos</Typography>
      <Videos videos={videos} />

      {/* Playlists Section */}
      <Typography variant="h5" color="white" mb={1} mt={4}>Playlists</Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {playlists.length > 0 ? (
          playlists.map((playlist) => {
            // Defensive check in case id or playlistId is missing
            const playlistId = playlist.id?.playlistId || playlist.id;
            return (
              <PlaylistCard key={playlistId} playlist={playlist} />
            );
          })
        ) : (
          <Typography color="gray">No playlists found.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default SearchFeed;
