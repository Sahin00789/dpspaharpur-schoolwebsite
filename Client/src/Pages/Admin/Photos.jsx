import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Image as ImageIcon, Edit2, Trash2, Upload } from 'lucide-react';

const Photos = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  // Mock data - replace with actual API call
  const [albums, setAlbums] = useState([
    {
      id: 1,
      title: 'Annual Day 2023',
      photoCount: 24,
      coverImage: 'https://via.placeholder.com/300x200?text=Annual+Day+2023',
      date: '2023-03-15',
    },
    {
      id: 2,
      title: 'Sports Day',
      photoCount: 18,
      coverImage: 'https://via.placeholder.com/300x200?text=Sports+Day',
      date: '2023-02-20',
    },
  ]);

  const handleDeleteAlbum = (id) => {
    setAlbums(albums.filter(album => album.id !== id));
  };

  const filteredAlbums = albums.filter(album =>
    album.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-4 md:mb-0">Photo Gallery</h1>
        <div className="flex space-x-3">
          <button
            onClick={() => navigate('/admin/photos/upload')}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Photos
          </button>
          <button
            onClick={() => navigate('/admin/albums/new')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Album
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search albums..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {filteredAlbums.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAlbums.map((album) => (
            <div key={album.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={album.coverImage}
                  alt={album.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 flex space-x-1">
                  <button
                    onClick={() => navigate(`/admin/albums/edit/${album.id}`)}
                    className="p-1.5 bg-white bg-opacity-80 rounded-full text-blue-600 hover:bg-opacity-100 transition-all"
                    title="Edit Album"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAlbum(album.id)}
                    className="p-1.5 bg-white bg-opacity-80 rounded-full text-red-600 hover:bg-opacity-100 transition-all"
                    title="Delete Album"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-medium text-gray-900">{album.title}</h3>
                <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                  <span>{album.photoCount} {album.photoCount === 1 ? 'photo' : 'photos'}</span>
                  <span>{new Date(album.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No albums found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Try a different search term.' : 'Get started by creating a new album.'}
          </p>
          <div className="mt-6">
            <button
              type="button"
              onClick={() => navigate('/admin/albums/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Plus className="-ml-1 mr-2 h-5 w-5" />
              New Album
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Photos;
