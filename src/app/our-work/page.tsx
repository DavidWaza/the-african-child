import React from "react";
import HeroLayout from "../HeroLayout";
import UnwrittenChapterStory from "../components/SuccessVideo";
import CreativeSuccessStories from "../components/SuccessStory";
import GalleryPage from "./components/Gallery";

const OurWork = () => {
  return (
    <HeroLayout>
      <GalleryPage />
      <UnwrittenChapterStory />
      <CreativeSuccessStories />
    </HeroLayout>
  );
};

export default OurWork;
