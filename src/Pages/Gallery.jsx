import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db, storage } from '../firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { FiImage, FiDownload, FiChevronLeft, FiChevronRight, FiX } from 'react-icons/fi';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // List all files in the 'gallery' folder
        const galleryRef = ref(storage, 'gallery/');
        const res = await listAll(galleryRef);
        
        const imageUrls = await Promise.all(
          res.items.map(async (item) => {
            const url = await getDownloadURL(item);
            return {
              url,
              name: item.name,
              ref: item.fullPath
            };
          })
        );
        
        setImages(imageUrls);
      } catch (error) {
        console.error('Error fetching images:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchImages();
  }, []);

  const openLightbox = (index) => {
    setSelectedImage(images[index]);
    setCurrentIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const navigate = (direction) => {
    let newIndex;
    if (direction === 'prev') {
      newIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    } else {
      newIndex = currentIndex === images.length - 1 ? 0 : currentIndex + 1;
    }
    setSelectedImage(images[newIndex]);
    setCurrentIndex(newIndex);
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading gallery...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Photo Gallery</h1>
          <p className="text-xl text-gray-600">Explore our school's memorable moments</p>
        </motion.div>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="relative group cursor-pointer overflow-hidden rounded-lg aspect-square bg-gray-100"
                onClick={() => openLightbox(index)}
              >
                <img
                  src={image.url}
                  alt={image.name}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white bg-opacity-80 p-2 rounded-full">
                    <FiImage className="w-5 h-5 text-gray-800" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-xl shadow-sm">
            <FiImage className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No photos yet</h3>
            <p className="mt-1 text-gray-500">Check back later for updates</p>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
          >
            <FiX className="w-8 h-8" />
          </button>
          
          <button
            onClick={() => navigate('prev')}
            className="absolute left-4 md:left-8 text-white hover:text-gray-300 transition-colors"
          >
            <FiChevronLeft className="w-10 h-10" />
          </button>
          
          <div className="relative max-w-4xl w-full h-full flex items-center justify-center">
            <img
              src={selectedImage.url}
              alt={selectedImage.name}
              className="max-h-full max-w-full object-contain"
            />
            <a
              href={selectedImage.url}
              download
              className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <FiDownload className="w-5 h-5 text-gray-800" />
            </a>
          </div>
          
          <button
            onClick={() => navigate('next')}
            className="absolute right-4 md:right-8 text-white hover:text-gray-300 transition-colors"
          >
            <FiChevronRight className="w-10 h-10" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Gallery;
