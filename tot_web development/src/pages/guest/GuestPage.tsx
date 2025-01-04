import { GuestBanner } from '../../components/guest/GuestBanner'; // Import GuestBanner
import { GuestTimer } from '../../components/guest/GuestTimer'; // Import GuestTimer
import { Features } from '../home/Feature';
import { Hero } from '../home/Hero';

const GuestPage = () => {
  return (
    <div className="container mx-auto p-4">
      <GuestBanner />
      <GuestTimer />

      <Hero />

      <Features />
    </div>
  );
};

export default GuestPage;
