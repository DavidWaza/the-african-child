"use client";
import React, { useState, useRef } from 'react';
import { FilmReel, Play } from '@phosphor-icons/react';
import { motion } from "framer-motion";

const VideoSuccessStory = () => {
  const studentName = "Amina";
  const organizationName = "The African Child Initiative";
  const videoSrc = "https://www.youtube.com/watch?v=eE9Dz9OROKA"; 
  const videoPoster = "/assets/amina.jpg";

  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play();
    }
  };

  const handleVideoPlay = () => {
    setIsPlaying(true);
  };

  const handleVideoPause = () => {
    setIsPlaying(false);
  };


  return (
    <div className="bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans pattern-bg">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8 text-center">
              <FilmReel className="mx-auto h-12 w-12 text-yellow-500 mb-3" />
              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900 dark:text-white">
                {studentName}&apos;s Story: A Journey of Transformation
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Watch how support from <span className='text-yellow-400 font-bold'>{organizationName}</span> changed everything.
              </p>
            </div>

            <div className="aspect-video rounded-lg shadow-xl overflow-hidden relative group">
              <video
                ref={videoRef}
                controls 
                poster={videoPoster}
                className="w-full h-full object-cover"
                preload="metadata"
                onPlay={handleVideoPlay}
                onPause={handleVideoPause}
                onEnded={handleVideoPause}
              >
                <source src={videoSrc} type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {!isPlaying && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 cursor-pointer transition-opacity duration-300 opacity-100 group-hover:bg-opacity-50"
                  onClick={handlePlayClick}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.div
                    className="bg-white bg-opacity-90 rounded-full p-4 shadow-lg"
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                  >
                    <Play className="h-12 w-12 md:h-16 md:w-16 text-yellow-600 fill-current" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default VideoSuccessStory;
