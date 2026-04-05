import React, { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useBrandStore } from '../store/brandStore';
import { BrandSwitcher } from '../components/BrandSwitcher';
import { PostComposer } from '../components/PostComposer';
import { PostCalendar } from '../components/PostCalendar';
import { BarChart3, Calendar, Edit3, LogOut } from 'lucide-react';

export const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { brands, selectedBrandId, fetchBrands } = useBrandStore();

  useEffect(() => {
    fetchBrands();
  }, [fetchBrands]);

  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">SocialHub</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Brand Switcher */}
        <div className="mb-8">
          <BrandSwitcher brands={brands} selectedBrandId={selectedBrandId} />
        </div>

        {selectedBrand ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Post Composer */}
            <div className="lg:col-span-2">
              <PostComposer brandId={selectedBrand.id} />
            </div>

            {/* Right: Calendar & Stats */}
            <div className="space-y-6">
              <PostCalendar brandId={selectedBrand.id} />

              {/* Quick Stats */}
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <BarChart3 size={20} />
                  Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total Posts</span>
                    <span className="font-semibold">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Engagement</span>
                    <span className="font-semibold">—</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Reach</span>
                    <span className="font-semibold">—</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Create Your First Brand
            </h2>
            <p className="text-gray-600">
              Start managing your social media by creating a brand.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};
