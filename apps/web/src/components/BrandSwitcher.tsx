import React from 'react';
import { useBrandStore, Brand } from '../store/brandStore';
import { Plus, ChevronDown } from 'lucide-react';

interface BrandSwitcherProps {
  brands: Brand[];
  selectedBrandId: string | null;
}

export const BrandSwitcher: React.FC<BrandSwitcherProps> = ({
  brands,
  selectedBrandId,
}) => {
  const { selectBrand } = useBrandStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const selectedBrand = brands.find((b) => b.id === selectedBrandId);

  return (
    <div className="relative inline-block w-full max-w-xs">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg flex items-center justify-between hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-2">
          {selectedBrand?.logo && (
            <img
              src={selectedBrand.logo}
              alt={selectedBrand.name}
              className="w-6 h-6 rounded"
            />
          )}
          <span className="font-medium">
            {selectedBrand?.name || 'Select a brand'}
          </span>
        </div>
        <ChevronDown size={20} className={isOpen ? 'rotate-180' : ''} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
          {brands.map((brand) => (
            <button
              key={brand.id}
              onClick={() => {
                selectBrand(brand.id);
                setIsOpen(false);
              }}
              className={`w-full px-4 py-2 text-left hover:bg-gray-100 transition ${
                brand.id === selectedBrandId ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-center gap-2">
                {brand.logo && (
                  <img src={brand.logo} alt={brand.name} className="w-5 h-5 rounded" />
                )}
                <span>{brand.name}</span>
              </div>
            </button>
          ))}

          <button className="w-full px-4 py-2 text-left border-t border-gray-200 hover:bg-gray-100 transition flex items-center gap-2 text-blue-500 font-medium">
            <Plus size={18} />
            Create New Brand
          </button>
        </div>
      )}
    </div>
  );
};
