import { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { GuestBanner } from '../../components/guestComponents/GuestBanner';
import { GuestTimer } from '../../components/guestComponents/GuestTimer';
import { Features } from '../../components/landingcomponents/Feature';
import Hero from '../Hero';

const HomePage = () => {
  const [isGuestMode, setIsGuestMode] = useState(false);

  return (
    <>
      <Navbar setIsGuestMode={setIsGuestMode} />
      {isGuestMode && (
        <>
          <GuestBanner />
          <GuestTimer />
        </>
      )}
      {/* Hero Section */}
      <Hero />
      {/* Features Section */}
      <Features />
    </>
  );
};

export default HomePage;
