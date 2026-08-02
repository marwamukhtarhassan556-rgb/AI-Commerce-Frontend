import { Outlet } from 'react-router-dom';
import Sidebar from '../merchant/Sidebar';
import TopBar from '../merchant/TopBar';

export default function MerchantLayout() {
  return (
    <div className="merchant-shell flex min-h-screen">
      {/* Sidebar ثابت على الشمال */}
      <Sidebar />

      {/* المحتوى الرئيسي بعد الـ Sidebar */}
      <div className="flex-1 flex min-w-0 flex-col lg:ml-[280px]">
        {/* TopBar ثابت في الأعلى */}
        <TopBar />

        {/* صفحات الداخل تظهر هنا تحت الـ TopBar */}
        <main className="flex-1 overflow-auto pt-16">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
