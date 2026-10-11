import React from 'react';
import { DataIntegrationSection } from '../components/DataIntegrationSection';
import { Vehicle } from '../types';

interface ApiDataPageProps {
  onSelectVehicle?: (vehicle: Vehicle) => void;
  onOpenBookingModal?: (experience?: string, vehicle?: string) => void;
  onNavigate?: (tab: string) => void;
}

/** Part IV: live REST API / JSON data integration (Dataset 1 products, Dataset 2 customers). */
export const ApiDataPage: React.FC<ApiDataPageProps> = (props) => {
  return (
    <div id="api-data-page" className="w-full">
      <div className="w-full px-6 md:px-10 pt-16 pb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="w-1.5 h-1.5 bg-[#D71920]" />
          <span className="text-xs text-[#8B8D8C]">Data integration</span>
        </div>
        <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl text-[#F4F4F1] font-semibold uppercase mb-4">
          LIVE API DATA
        </h1>
        <p className="text-sm text-[#8B8D8C] leading-relaxed max-w-2xl">
          Every car, service and customer inquiry on this site is loaded from our REST API. Browse the two datasets
          below or call an endpoint yourself in the console.
        </p>
      </div>
      <DataIntegrationSection {...props} />
    </div>
  );
};

export default ApiDataPage;
