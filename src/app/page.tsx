import Herobanner from "./components/Herobanner";
import Reason from "./components/ReasonComponent";
import SupportedCountries from "./components/SupportedCountries";
import SuccessStory from "./components/SuccessStory";
import UnwrittenChapterStory from "./components/SuccessVideo";
import DonateComp from "./components/DonateWithUs";
import JoinUs from "./components/JoinUs";
import NigeriaMap from "./components/NigerianMap";

export default function Home() {
  return (
    <div>
      <Herobanner />
      <NigeriaMap />
      <Reason />
      <SupportedCountries />
      <UnwrittenChapterStory />
      <SuccessStory />
      <DonateComp />
      <JoinUs />
    </div>
  );
}
