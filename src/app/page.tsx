import Herobanner from "./components/Herobanner";
import Reason from "./components/ReasonComponent";
import SupportedCountries from "./components/SupportedCountries";
import SuccessStory from "./components/SuccessStory";
import UnwrittenChapterStory from "./components/SuccessVideo";

export default function Home() {
  return (
    <div>
      <Herobanner />
      <Reason />
      <SupportedCountries />
      <UnwrittenChapterStory />
      <SuccessStory />
    </div>
  );
}
