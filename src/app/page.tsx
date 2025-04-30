import Herobanner from "./components/Herobanner";
import Reason from "./components/ReasonComponent";
import SupportedCountries from "./components/SupportedCountries";

export default function Home() {
  return (
    <div>
      <Herobanner />
      <Reason />
      <SupportedCountries />
    </div>
  );
}
