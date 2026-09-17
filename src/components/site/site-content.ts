/** Static marketing content, kept out of the page markup. */
import type { IconName } from "@/lib/icons";

export const SITE_CONTACT = {
  address: "123 Education Way, Knowledge City, NG 10001",
  phone: "+234 800 123 4567",
  email: "info@theafricanchild.org",
  hours: "Mon – Fri, 9am – 5pm WAT",
};

export const BARRIERS: { icon: IconName; title: string; text: string }[] = [
  {
    icon: "naira",
    title: "The barrier of poverty",
    text: "Many families can't afford secondary school fees, uniforms, books or transport — so bright children leave school after primary.",
  },
  {
    icon: "location",
    title: "Distance and safety",
    text: "In rural areas the nearest secondary school can be miles away. Long, unsafe journeys push children — especially girls — out of class.",
  },
  {
    icon: "school",
    title: "Our role in solutions",
    text: "We pay fees directly to schools and provide uniforms, books, feeding and transport, so cost is never the reason a child stops learning.",
  },
  {
    icon: "children",
    title: "Community & inclusion",
    text: "We work with families and community leaders to champion education for every child, including girls and children with disabilities.",
  },
];

export const STORIES = [
  {
    name: "Amina",
    title: "A renewed dream",
    image: "/assets/amina.jpg",
    text: "Top of her primary class, Amina feared her education would end because of costs. Support covered her fees and supplies — she now wants to be a doctor.",
  },
  {
    name: "David",
    title: "An open door",
    image: "/assets/student-2.png",
    text: "Living rurally, David faced barriers to quality secondary education. Funding for school opened the door to better teachers and a physics club.",
  },
  {
    name: "Chidinma",
    title: "Finding her path",
    image: "/assets/student.jpg",
    text: "After a year out of school helping her family, Chidinma received a scholarship. Now back and more determined, she leads her debate team.",
  },
  {
    name: "Samuel",
    title: "Free to focus",
    image: "/assets/student-3.png",
    text: "Distracted by financial worries, Samuel struggled at first. Consistent support means he can focus purely on his studies.",
  },
];

export const PROGRAMME_PILLARS: { icon: IconName; title: string; text: string }[] = [
  { icon: "school", title: "Tuition & levies", text: "Paid directly to the school bursar each term, with receipts logged against the child." },
  { icon: "document", title: "Books & uniforms", text: "Every student starts the session with a full set of textbooks, writing materials and uniforms." },
  { icon: "family", title: "Feeding & transport", text: "Lunch support and transport fares so hunger and distance don't keep children out of class." },
  { icon: "teacher", title: "Mentoring & exams", text: "Term reviews with teachers, WAEC/NECO registration and exam preparation for senior students." },
];

export const GALLERY = [
  { src: "/assets/abubakar-balogun-OlJk99PX0Os-unsplash.jpg", title: "Hope & smiles", category: "Education" },
  { src: "/assets/muslim-school-kids.jpg", title: "Nurturing future leaders", category: "Education" },
  { src: "/assets/community-painting-wood-medium-shot.jpg", title: "Community outreach", category: "Community" },
  { src: "/assets/group-african-kids-standing-each-other-class.jpg", title: "Joyful learning", category: "Education" },
  { src: "/assets/bill-wegener-7MD4DR9jbP0-unsplash.jpg", title: "Access to clean water", category: "Community" },
  { src: "/assets/group-classroom.jpg", title: "Classroom days", category: "Education" },
];

export const TEAM = [
  {
    name: "Idemeto Emediong",
    role: "Co-founder & Director of Programmes",
    image: "/assets/waza.jpg",
    bio: "Leads our programmes and makes sure support reaches the children who need it most.",
  },
  {
    name: "Queen Benedict Akpan",
    role: "Community Outreach Lead & Project Manager",
    image: "/assets/queen.jpg",
    bio: "Connects us with communities, building the bridges and trust our work depends on.",
  },
];

export const PARTNERS = [
  "Innovate Corp",
  "Future Solutions",
  "EduGrowth Hub",
  "Africa Tech Now",
  "Community Builders",
  "Global Reach",
  "Sunrise Ventures",
  "NextGen Leaders",
];

export const INVOLVEMENT: { icon: IconName; title: string; text: string; cta: string; topic: string }[] = [
  {
    icon: "family",
    title: "Lend your hands & heart",
    text: "Your time and skills can directly uplift children's lives — through mentoring, homework clubs, or helping at community events.",
    cta: "Volunteer with us",
    topic: "volunteer",
  },
  {
    icon: "givers",
    title: "Partner with us",
    text: "We collaborate with schools, organisations and community leaders who share our vision for educating Nigerian children.",
    cta: "Become a partner",
    topic: "partnership",
  },
  {
    icon: "sparkle",
    title: "Host a fundraiser",
    text: "Rally your community — a birthday, a run, an online campaign. Every effort keeps another child in class.",
    cta: "Plan a fundraiser",
    topic: "fundraiser",
  },
  {
    icon: "school",
    title: "Corporate support",
    text: "Sponsor a whole class or school through your CSR programme, with the same term-by-term reporting our givers get.",
    cta: "Talk to our team",
    topic: "corporate",
  },
];

export const VIDEO_STORY = {
  youtubeId: "eE9Dz9OROKA",
  poster: "/assets/amina.jpg",
  title: "Amina's story: a journey of transformation",
};
