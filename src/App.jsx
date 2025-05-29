import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Box } from '@mui/material'; 
import { Navbar, Feed, VideoDetail, ChannelDetail, SearchFeed } from './components';
import PlaylistDetail from './components/PlaylistDetail'; // import it here

const App = () => (
  <BrowserRouter>
    <Box sx={{ backgroundColor: '#000' }}>
      <Navbar />
      <Routes>
        <Route path='/' exact element={<Feed />} />
        <Route path='/video/:id' element={<VideoDetail />} />
        <Route path='/channel/:id' element={<ChannelDetail />} />
        <Route path='/search/:searchTerm' element={<SearchFeed />} />
        <Route path='/playlist/:id' element={<PlaylistDetail />} /> {/* Add this */}
      </Routes>
    </Box>
  </BrowserRouter>
)

export default App;
