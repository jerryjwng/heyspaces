import { Navbar } from '@/components/shared/navbar';
import { Footer } from '@/components/shared/footer';

const Dashboard = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <div className="container mx-auto flex-1 px-6 py-16 text-center">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <p className="mt-2 text-muted-foreground">Wird in Screen 6 implementiert.</p>
    </div>
    <Footer />
  </div>
);

export default Dashboard;
