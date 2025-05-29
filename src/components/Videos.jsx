import { Stack, Box } from "@mui/material";
import { VideoCard, ChannelCard, PlaylistCard } from './';  // import PlaylistCard

const Videos = ({ videos, direction }) => {
  if (!videos?.length) return 'Loading...';

  return (
    <Stack direction={direction || "row"} flexWrap="wrap" justifyContent="start" gap={2}>
      {videos.map((item, idx) => (
        <Box key={idx}>
          {/* Normal video */}
          {item.id?.videoId && <VideoCard video={item} />}
          
          {/* Video inside a playlist (playlistItems endpoint) */}
          {item.snippet?.resourceId?.videoId && <VideoCard video={{ id: { videoId: item.snippet.resourceId.videoId }, snippet: item.snippet }} />}
          
          {/* Channel */}
          {item.id?.channelId && <ChannelCard channelDetail={item} />}
          
          {/* Playlist */}
          {item.id?.playlistId && <PlaylistCard playlist={item} />}
        </Box>
      ))}
    </Stack>
  );
};

export default Videos;
