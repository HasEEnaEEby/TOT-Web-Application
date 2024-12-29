// src/pages/guest/GuestPage.tsx
import { GuestBanner } from '../../components/guestComponents/GuestBanner'; // Import GuestBanner
import { GuestTimer } from '../../components/guestComponents/GuestTimer'; // Import GuestTimer
import { Features } from '../../components/landingcomponents/Feature';
import { Hero } from '../Hero';

const GuestPage = () => {
  return (
    <div className="container mx-auto p-4">
      {/* Display Guest Banner and Timer */}
      <GuestBanner />
      <GuestTimer />

      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />
    </div>
  );
};

export default GuestPage;
