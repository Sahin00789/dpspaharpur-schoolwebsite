import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiImage, FiDownload, FiChevronLeft, FiChevronRight, FiX, FiFilter } from 'react-icons/fi';
import { GALLERY_IMAGES, GALLERY_CATEGORIES } from '../../data/galleryImages';

// Add a simple error boundary
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Gallery Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center p-8 max-w-md">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">We're having trouble loading the gallery. Please try again later.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Gallery = () => {
  // Check if required data is available
  if (!GALLERY_IMAGES || !GALLERY_CATEGORIES) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Group images by category
  const imagesByCategory = useMemo(() => {
    const groups = {};
    
    GALLERY_CATEGORIES.forEach(category => {
      if (category.id === 'all') return;
      
      const categoryImages = GALLERY_IMAGES.filter(image => 
        image.category === category.id &&
        (image.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
         image.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      if (categoryImages.length > 0) {
        groups[category.id] = {
          name: category.name,
          images: categoryImages
        };
      }
    });
    
    return groups;
  }, [searchQuery]);
  
  // Check if there are any images to display
  const hasImages = Object.keys(imagesByCategory).length > 0;

  const openLightbox = (index) => {
    // Get all images from all categories
    const allImages = [];
    Object.values(imagesByCategory).forEach(category => {
      allImages.push(...category.images);
    });
    
    setSelectedImage(allImages[index]);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };
  
  const navigateImage = (direction) => {
    // Get all images from all categories
    const allImages = [];
    Object.values(imagesByCategory).forEach(category => {
      allImages.push(...category.images);
    });
    
    let newIndex;
    if (direction === 'prev') {
      newIndex = (currentIndex - 1 + allImages.length) % allImages.length;
    } else {
      newIndex = (currentIndex + 1) % allImages.length;
    }
    setSelectedImage(allImages[newIndex]);
    setCurrentIndex(newIndex);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  // No loading state needed for static images
  const loading = false;

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-600 mb-6">Explore our school's memorable moments</p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search photos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {hasImages ? (
          <div className="space-y-12">
            {Object.entries(imagesByCategory).map(([categoryId, categoryData]) => (
              <div key={categoryId} className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-2">
                  {categoryData.name}
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {categoryData.images.map((image, index) => (
                    <motion.div
                      key={`${categoryId}-${index}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.03 }}
                      className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100"
                      onClick={() => {
                        // Find the global index of this image for lightbox navigation
                        const allImages = [];
                        Object.values(imagesByCategory).forEach(cat => {
                          allImages.push(...cat.images);
                        });
                        const globalIndex = allImages.findIndex(img => img.id === image.id);
                        openLightbox(globalIndex);
                      }}
                    >
                      <img
                        src={image.thumbnail || image.url}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100">
                        <h3 className="text-white font-medium text-sm">{image.title}</h3>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">
              {GALLERY_IMAGES.length === 0 ? 'No photos available' : 'No matching photos found'}
            </h3>
            <p className="mt-1 text-gray-500">
              {GALLERY_IMAGES.length === 0 
                ? 'Check back later for updates.'
                : 'Try adjusting your search criteria.'}
            </p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <button 
              onClick={(e) => {
                e.stopPropagation();
                closeLightbox();
              }}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <FiX className="w-8 h-8" />
            </button>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('prev');
              }}
              className="absolute left-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <FiChevronLeft className="w-6 h-6" />
            </button>
            
            <div 
              className="max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                key={selectedImage.url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.title}
                  className="max-w-full max-h-[80vh] object-contain"
                  draggable="false"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <p className="text-white font-medium">
                    {selectedImage.title}
                  </p>
                  <p className="text-sm text-gray-200 mt-1">
                    {selectedImage.description}
                  </p>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-300 bg-black/50 px-2 py-1 rounded">
                      {selectedImage.category || 'Uncategorized'}
                    </span>
                    <span className="text-xs text-gray-300">
                      {new Date(selectedImage.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
            
            <button 
              onClick={(e) => {
                e.stopPropagation();
                navigateImage('next');
              }}
              className="absolute right-4 bg-black bg-opacity-50 text-white p-3 rounded-full hover:bg-opacity-75 transition-all z-10"
            >
              <FiChevronRight className="w-6 h-6" />
            </button>
            
            <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm">
              {currentIndex + 1} of {Object.values(imagesByCategory).reduce((total, cat) => total + cat.images.length, 0)}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Wrap the Gallery component with ErrorBoundary
export default function GalleryWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <Gallery />
    </ErrorBoundary>
  );
}
