
"use client";
import Image from "next/image";
import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Tag,
  Layers,
} from "lucide-react";

const galleryImages = [
  {
    id: 1,
    src: "/assets/abubakar-balogun-OlJk99PX0Os-unsplash.jpg",
    alt: "Children smiling and playing, representing hope.",
    title: "Hope & Smiles",
    category: "Education",
    width: 1200,
    height: 800,
    description:
      "A snapshot of children engaging in our after-school learning program, full of joy and curiosity.",
    story:
      "This photo was taken during a literacy workshop. The children had just finished reading a new storybook together, and their excitement was palpable. It reminds us why access to education is so transformative.",
  },
  {
    id: 2,
    src: "/assets/community-painting-wood-medium-shot.jpg",
    alt: "A health worker attending to a community member.",
    title: "Community Health Drive",
    category: "Healthcare",
    width: 800,
    height: 1200,
    description:
      "Our dedicated health team providing essential check-ups during a community outreach event.",
    story:
      "During this health drive, we were able to provide vaccinations to over 100 children and offer health consultations to families who rarely have access to medical professionals. Every interaction makes a difference.",
  },
  {
    id: 3,
    src: "/assets/close-up-happy-woman-selling-food.jpg",
    alt: "Women participating in a skills training workshop.",
    title: "Skills for Empowerment",
    category: "Empowerment",
    width: 1050,
    height: 700,
    description:
      "Women learning new vocational skills to support their families and build brighter futures.",
    story:
      "These incredible women are learning tailoring skills. For many, this is their first opportunity to gain financial independence. Their determination is truly inspiring.",
  },
  {
    id: 4,
    src: "/assets/muslim-school-kids.jpg",
    alt: "Students in a classroom setting.",
    title: "Nurturing Future Leaders",
    category: "Education",
    width: 1200,
    height: 800,
    description:
      "Bright young minds eager to learn in one of the schools we support with educational materials.",
    story:
      "This classroom was recently equipped with new desks and books thanks to our donors. You can see the eagerness to learn in their eyes – these are the future leaders of their communities.",
  },
  {
    id: 5,
    src: "/assets/bill-wegener-7MD4DR9jbP0-unsplash.jpg",
    alt: "Community members accessing a new clean water well.",
    title: "Access to Clean Water",
    category: "WASH",
    width: 1350,
    height: 900,
    description:
      "A new borehole providing safe and clean drinking water to a rural community.",
    story:
      "Before this well was installed, families, mostly women and children, had to walk several kilometers each day to fetch water. Now, they have more time for education and other productive activities.",
  },
  {
    id: 6,
    src: "/assets/group-african-kids-standing-each-other-class.jpg",
    alt: "Children playing educational games.",
    title: "Joyful Learning",
    category: "Education",
    width: 1125,
    height: 750,
    description:
      "Play-based learning activities that make education fun and engaging for young children.",
    story:
      "We believe learning should be joyful. These educational games help develop critical thinking and teamwork skills in a fun environment. The laughter we hear from this room is a testament to its success.",
  },
];

const staticBlurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOCIgaGVpZ2h0PSI1IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0wIDBoOHY1SDB6IiBmaWxsPSIjZWFhZWFhIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48L3N2Zz4=";

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeInOut" },
  },
  exit: { opacity: 0, y: -20, transition: { duration: 0.4, ease: "easeIn" } },
};

const sentenceVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: {
      delay: 0.2,
      staggerChildren: 0.04,
    },
  },
};
const letterVariants = {
  hidden: { opacity: 0, y: 20, rotateX: -90, transformOrigin: "50% 50% -10px" },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: [0.6, -0.05, 0.01, 0.99],
    },
  },
};

const subtitleVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const filterButtonVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  hover: { scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" },
  tap: { scale: 0.95 },
};

const gridContainerVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.6, -0.05, 0.01, 0.99] },
  },
  hover: {
    y: -10,
    rotate: 1.5,
    scale: 1.05,
    boxShadow: "0px 20px 40px rgba(0, 50, 80, 0.25)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.3, ease: "easeIn" },
  },
};

const cardImageOverlayVariants = {
  initial: { opacity: 0 },
  hover: { opacity: 1, transition: { duration: 0.35, ease: "easeInOut" } },
};

const overlayContentVariants = {
  initial: { y: 15, opacity: 0, scale: 0.9 },
  hover: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut", delay: 0.1 },
  },
};

const lightboxBackdropVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.25, ease: "easeIn" } },
};

const lightboxContentVariants = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.35, ease: "easeOut", delay: 0.1 },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    y: 20,
    transition: { duration: 0.25, ease: "easeIn" },
  },
};

const lightboxImageVariants = {
  initial: { opacity: 0, x: 50, scale: 0.98 },
  animate: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
  exit: {
    opacity: 0,
    x: -50,
    scale: 0.98,
    transition: { duration: 0.3, ease: "easeInOut" },
  },
};

const lightboxTextContainerVariants = {
  initial: {},
  animate: { transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
};
const lightboxTextItemVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function GalleryPage() {
  const [lightboxImage, setLightboxImage] = useState<
    null | (typeof galleryImages)[0]
  >(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<string>("All");

  const pageTitle = "Moments of Impact";
  const pageSubtitle =
    "Explore our gallery to witness the stories, smiles, and transformative change we are creating together. Click any image to see its story.";

  const categories = useMemo(
    () => ["All", ...new Set(galleryImages.map((img) => img.category))],
    []
  );

  const filteredImages = useMemo(() => {
    if (activeFilter === "All") return galleryImages;
    return galleryImages.filter((image) => image.category === activeFilter);
  }, [activeFilter]);

  const openLightbox = (image: (typeof galleryImages)[0]) => {
    const actualIndex = filteredImages.findIndex((img) => img.id === image.id);
    setLightboxImage(image);
    setLightboxIndex(actualIndex);
  };

  const closeLightbox = () => {
    setLightboxImage(null);
  };

  const goToNextLightbox = () => {
    const nextIndex = (lightboxIndex + 1) % filteredImages.length;
    setLightboxImage(filteredImages[nextIndex]);
    setLightboxIndex(nextIndex);
  };

  const goToPreviousLightbox = () => {
    const prevIndex =
      (lightboxIndex - 1 + filteredImages.length) % filteredImages.length;
    setLightboxImage(filteredImages[prevIndex]);
    setLightboxIndex(prevIndex);
  };

  if (typeof window !== "undefined") {
    window.onkeydown = (event) => {
      if (lightboxImage) {
        if (event.key === "Escape") closeLightbox();
        if (event.key === "ArrowRight") goToNextLightbox();
        if (event.key === "ArrowLeft") goToPreviousLightbox();
      }
    };
  }

  return (
    <section>
     

      <motion.div
        className="min-h-screen bg-slate-50 text-slate-800 selection:bg-sky-200 selection:text-sky-800 px-6 sm:px-12 md:px-20 lg:px-36"
        style={{
          backgroundImage:
            "linear-gradient(rgba(248,250,252,0.9), rgba(248,250,252,0.9)), url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='28' viewBox='0 0 28 28'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='subtle-dots' fill='%23cbd5e1' fill-opacity='0.07'%3E%3Cpath d='M2 2h2v2H2V2zm4 4h2v2H6V6zm8-4h2v2h-2V2zm0 12h2v2h-2v-2zm-4 4h2v2h-2v-2zm-4-4h2v2H6v-2zm12-4h2v2h-2V6zm4-4h2v2h-2V2zm0 12h2v2h-2v-2zM6 14h2v2H6v-2zm12 0h2v2h-2v-2zM2 14h2v2H2v-2zm4 4h2v2H6v-2zm8-4h2v2h-2v-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <header className="py-12 md:py-20 text-center overflow-hidden">
          <motion.h1
            className="text-2xl md:text-5xl lg:text-6xl font-extrabold text-[#3D7464] bg-clip-text mb-6 inline-block"
            variants={sentenceVariants}
            initial="hidden"
            animate="visible"
          >
            {pageTitle.split("").map((char, index) => (
              <motion.span
                key={char + "-" + index}
                variants={letterVariants}
                className="inline-block"
              >
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            className="md:text-xl text-slate-600 max-w-3xl mx-auto px-4"
            variants={subtitleVariants}
            initial="initial"
            animate="animate"
            transition={{ delay: pageTitle.length * 0.04 + 0.5 }}
          >
            {pageSubtitle}
          </motion.p>
        </header>

        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 mb-8 md:mb-12 flex flex-wrap justify-center gap-3 md:gap-4"
          initial="initial"
          animate="animate"
          transition={{
            staggerChildren: 0.07,
            delayChildren: pageTitle.length * 0.04 + 0.8,
          }}
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => setActiveFilter(category)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500
                ${
                  activeFilter === category
                    ? "bg-sky-500 text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-sky-50 border border-slate-300 hover:border-sky-400"
                }`}
              variants={filterButtonVariants}
              whileHover="hover"
              whileTap="tap"
            >
              {category === "All" ? (
                <Layers size={16} className="inline mr-1.5 -mt-0.5" />
              ) : (
                <Tag size={14} className="inline mr-1.5 -mt-0.5" />
              )}
              {category}
            </motion.button>
          ))}
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10"
            variants={gridContainerVariants}
            initial="initial"
            animate="animate"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image) => (
                <motion.div
                  key={image.id}
                  layout
                  className="bg-white rounded-xl shadow-lg hover:shadow-2xl overflow-hidden cursor-pointer group flex flex-col"
                  onClick={() => openLightbox(image)}
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                >
                  <div className="w-full aspect-[4/3] relative overflow-hidden">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={image.width}
                      height={image.height}
                      layout="responsive"
                      objectFit="cover"
                      priority={galleryImages.indexOf(image) < 3}
                      className="transition-transform duration-350 ease-in-out group-hover:scale-110 group-hover:rotate-1"
                      placeholder="blur"
                      blurDataURL={staticBlurDataURL}
                    />
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent flex flex-col justify-end items-center text-center p-5"
                      variants={cardImageOverlayVariants}
                    >
                      <motion.div
                        variants={overlayContentVariants}
                        className="flex items-center text-white/95"
                      >
                        <ZoomIn
                          size={30}
                          className="mr-2.5 opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                        />
                        <span className="text-lg font-semibold tracking-wide">
                          View Story
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                  <div className="p-5 md:p-6 flex-grow flex flex-col">
                    <div className="mb-3">
                      <span
                        className={`inline-flex items-center px-3.5 py-1 rounded-full text-xs font-semibold
                        ${
                          image.category === "Education"
                            ? "bg-blue-100 text-blue-700"
                            : image.category === "Healthcare"
                            ? "bg-green-100 text-green-700"
                            : image.category === "Empowerment"
                            ? "bg-yellow-100 text-yellow-700"
                            : image.category === "WASH"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                      >
                        <Tag size={14} className="mr-1.5" />
                        {image.category}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors duration-300">
                      {image.title}
                    </h3>
                    <p className="text-sm text-slate-600 line-clamp-3 flex-grow">
                      {image.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        <AnimatePresence>
          {lightboxImage && (
            <motion.div
              className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[100] p-4"
              variants={lightboxBackdropVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              onClick={closeLightbox}
            >
              <motion.div
                className="bg-white rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row relative"
                variants={lightboxContentVariants}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-3 right-3 md:top-4 md:right-4 text-slate-500 hover:text-[#3D7464] transition-colors z-[120]
                             bg-white/70 hover:bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-md"
                  aria-label="Close lightbox"
                >
                  <X size={22} />
                </button>

                <div className="w-full md:w-3/5 h-64 md:h-auto relative bg-slate-100">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={lightboxImage.id}
                      className="absolute inset-0"
                      variants={lightboxImageVariants}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                    >
                      <Image
                        src={lightboxImage.src}
                        alt={lightboxImage.alt}
                        layout="fill"
                        objectFit="contain"
                        priority
                      />
                    </motion.div>
                  </AnimatePresence>
                </div>

                <motion.div
                  className="w-full md:w-2/5 p-6 pt-8 md:p-8 flex flex-col justify-start overflow-y-auto"
                  variants={lightboxTextContainerVariants}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h3
                    variants={lightboxTextItemVariants}
                    className="text-2xl lg:text-3xl font-bold text-[#3D7464] mb-3"
                  >
                    {lightboxImage.title}
                  </motion.h3>
                  <motion.div
                    variants={lightboxTextItemVariants}
                    className="mb-4"
                  >
                    <span
                      className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-semibold
                        ${
                          lightboxImage.category === "Education"
                            ? "bg-blue-100 text-blue-700"
                            : lightboxImage.category === "Healthcare"
                            ? "bg-green-100 text-green-700"
                            : lightboxImage.category === "Empowerment"
                            ? "bg-yellow-100 text-yellow-700"
                            : lightboxImage.category === "WASH"
                            ? "bg-teal-100 text-teal-700"
                            : "bg-sky-100 text-sky-700"
                        }`}
                    >
                      <Tag size={14} className="mr-1.5" />{" "}
                      {lightboxImage.category}
                    </span>
                  </motion.div>
                  <motion.p
                    variants={lightboxTextItemVariants}
                    className="text-slate-600 text-base mb-5 leading-relaxed"
                  >
                    {lightboxImage.description}
                  </motion.p>
                  {lightboxImage.story && (
                    <motion.div
                      variants={lightboxTextItemVariants}
                      className="mt-4 pt-4 border-t border-slate-200"
                    >
                      <h4 className="text-sm font-semibold uppercase tracking-wider text-[#3D7464] mb-2">
                        The Story Behind
                      </h4>
                      <p className="text-slate-500 text-sm leading-relaxed">
                        {lightboxImage.story}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToPreviousLightbox();
                }}
                className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Previous image"
                disabled={filteredImages.length <= 1}
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToNextLightbox();
                }}
                className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 bg-black/40 text-white p-2.5 rounded-full hover:bg-black/60 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next image"
                disabled={filteredImages.length <= 1}
              >
                <ChevronRight size={28} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </section>
  );
}
