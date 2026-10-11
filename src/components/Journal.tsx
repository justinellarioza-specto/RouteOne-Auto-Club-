import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Article } from '../data/marketingData';
import { useTheme } from '../context/ThemeContext';

interface JournalProps {
  onSelectArticle: (article: Article) => void;
  onViewAllArticles?: () => void;
}

export const Journal: React.FC<JournalProps> = ({
  onSelectArticle,
  onViewAllArticles,
}) => {
  const { isGarageLight } = useTheme();

  const articles: (Article & { num: string })[] = [
    {
      id: 'aerodynamics-f1',
      num: '01',
      title: 'The art of aerodynamics',
      subtitle: 'Sculpting air for downforce without aerodynamic drag penalty.',
      excerpt: 'How aerodynamic thinking shapes modern performance vehicles.',
      category: 'ENGINEERING',
      readTime: '5 MIN READ',
      date: 'OCT 2026',
      author: 'Julian Vance, Chief Aerodynamicist',
      image: '/images/cars/aston-amr24.webp',
      content: [
        'Downforce is the invisible currency of circuit speed. In motorsport, every surface is an active aerodynamic tool.',
        'Modern ground-effect underfloors and venturi channels generate vast downforce without creating turbulence-induced drag penalties.',
        'At RouteOne, understanding airflow is paramount to unlocking lap times on the circuit.',
      ],
    },
    {
      id: 'behind-the-machine',
      num: '02',
      title: 'Behind the machine',
      subtitle: 'Dissecting naturally aspirated acoustic resonance.',
      excerpt: 'A closer look at the engineering behind high-performance cars.',
      category: 'POWERTRAIN',
      readTime: '6 MIN READ',
      date: 'OCT 2026',
      author: 'Marcus Sterling, Technical Director',
      image: '/images/cars/ferrari-f2004.webp',
      content: [
        'Behind every performance machine lies hundreds of hours of metallurgical calibration.',
        'Naturally aspirated V10 and V12 engines provide a linear throttle modulation that modern forced induction struggles to match.',
        'When you command 9,000 RPM, the soundtrack is not noise — it is pure acoustic engineering.',
      ],
    },
    {
      id: 'one-lap-philosophy',
      num: '03',
      title: 'One lap',
      subtitle: 'The pursuit of the perfect qualifying apex.',
      excerpt: 'Why precision matters more than simply going fast.',
      category: 'DRIVING DISCIPLINE',
      readTime: '4 MIN READ',
      date: 'NOV 2026',
      author: 'Elena Rostova, Pro Driver Coach',
      image: '/images/cars/redbull-rb20.webp',
      content: [
        'Speed is a byproduct of balance. Going fast is easy; driving with absolute precision is rare.',
        'A single lap at full throttle requires relentless focus on braking markers, weight transition, and tire slip angle.',
        'One clean lap rewards patience over aggression every single time.',
      ],
    },
  ];

  return (
    <section
      id="journal-section"
      className={`w-full px-6 md:px-10 py-16 border-b transition-colors duration-300 ${
        isGarageLight
          ? 'bg-[#F6F7F5] border-black/[0.08]'
          : 'bg-[#111314] border-white/[0.08]'
      }`}
    >
      {/* Header */}
      <div
        className={`flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b gap-4 transition-colors duration-300 ${
          isGarageLight ? 'border-black/[0.08]' : 'border-white/[0.06]'
        }`}
      >
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 bg-[#D71920]" />
            <span
              className={`text-xs ${
                isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
              }`}
            >
              Editorial
            </span>
          </div>
          <h2
            className={`font-heading text-2xl sm:text-3xl font-semibold ${
              isGarageLight ? 'text-[#111415]' : 'text-[#F4F4F1]'
            }`}
          >
            Latest from RouteOne
          </h2>
        </div>

        {onViewAllArticles && (
          <button
            onClick={onViewAllArticles}
            className={`text-[11px] transition-colors cursor-pointer ${
              isGarageLight
                ? 'text-[#565C62] hover:text-[#111415]'
                : 'text-[#8B8D8C] hover:text-[#F4F4F1]'
            }`}
          >
            View all perspectives →
          </button>
        )}
      </div>

      {/* 3 Articles with Small Image Beside Each Article */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {articles.map((item) => (
          <article
            key={item.id}
            onClick={() => onSelectArticle(item)}
            className={`group cursor-pointer border p-4 transition-all duration-300 flex flex-col justify-between rounded-sm ${
              isGarageLight
                ? 'bg-white border-black/10 hover:border-[#D71920]/40 shadow-[0_4px_16px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_24px_rgba(0,0,0,0.06)]'
                : 'bg-[#151718] border-white/[0.08] hover:border-white/20'
            }`}
          >
            <div>
              {/* Row with Small Image Beside Article Number/Meta */}
              <div className="flex gap-4 mb-4">
                <div
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 shrink-0 overflow-hidden bg-black border rounded-sm ${
                    isGarageLight ? 'border-black/10' : 'border-white/[0.08]'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover filter brightness-90 contrast-[1.05] transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>

                <div className="flex flex-col justify-between py-0.5">
                  <div>
                    <span
                      className={`font-heading text-xs ${
                        isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                      }`}
                    >
                      {item.num}
                    </span>
                    <span
                      className={`block text-[11px] mt-1 ${
                        isGarageLight ? 'text-[#8C9399]' : 'text-[#505251]'
                      }`}
                    >
                      {item.category.charAt(0) + item.category.slice(1).toLowerCase()}
                    </span>
                  </div>

                  <span
                    className={`text-[11px] ${
                      isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                    }`}
                  >
                    {item.readTime}
                  </span>
                </div>
              </div>

              {/* Title & Short Text */}
              <h3
                className={`font-heading text-base sm:text-lg font-medium mb-2 transition-colors ${
                  isGarageLight
                    ? 'text-[#111415] group-hover:text-[#D71920]'
                    : 'text-[#F4F4F1] group-hover:text-white'
                }`}
              >
                {item.title}
              </h3>

              <p
                className={`text-xs font-light leading-relaxed mb-4 ${
                  isGarageLight ? 'text-[#565C62]' : 'text-[#8B8D8C]'
                }`}
              >
                {item.excerpt}
              </p>
            </div>

            {/* Read Link */}
            <div
              className={`pt-3 border-t flex items-center justify-between text-xs transition-colors ${
                isGarageLight
                  ? 'border-black/[0.06] text-[#565C62] group-hover:text-[#D71920]'
                  : 'border-white/[0.06] text-[#8B8D8C] group-hover:text-[#D71920]'
              }`}
            >
              <span>Read dispatch</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
