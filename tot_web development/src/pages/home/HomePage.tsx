import { useState } from 'react';
import { GuestBanner } from '../../components/guest/GuestBanner';
import { GuestTimer } from '../../components/guest/GuestTimer';
import { Footer } from '../layout/Footer';
import { Navbar } from '../layout/Navbar';
import { CallToAction } from './CallToAction';
import { Features } from './Feature';
import { Hero } from './Hero';
import { HowItWorks } from './HowItWorks';
import { Testimonials } from './Testiminials';

const HomePage = () => {
  const [isGuestMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {isGuestMode && <GuestBanner />}
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
      <Footer />
      {isGuestMode && (
        <div className="fixed bottom-4 right-4 bg-background p-4 rounded-lg shadow-lg border">
          <GuestTimer />
        </div>
      )}
    </div>
  );
};

export default HomePage;
