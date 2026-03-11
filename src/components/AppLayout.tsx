import { Outlet } from "react-router-dom";
import MobileTabBar from "./MobileTabBar";
import DesktopSidebar from "./DesktopSidebar";

const AppLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <DesktopSidebar />
      <main className="md:pl-60 pb-20 md:pb-0">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
};

export default AppLayout;
