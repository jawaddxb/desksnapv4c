/**
 * ScrollIndicator - Floating navigation dots showing current section
 * Fixed position on right side with smooth scroll navigation
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Section {
  id: string;
  label: string;
}

const sections: Section[] = [
  { id: 'hero', label: 'Home' },
  { id: 'problem', label: 'Problem' },
  { id: 'process', label: 'Process' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'cta', label: 'Get Started' },
];

export const ScrollIndicator: React.FC = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      for (const section of sections) {
        const element = document.getElementById(section.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
      {sections.map((section, index) => (
        <motion.button
          key={section.id}
          onClick={() => scrollToSection(section.id)}
          className="group relative flex items-center justify-end"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        >
          {/* Dot */}
          <motion.div
            className={`w-3 h-3 rounded-full transition-all ${
              activeSection === section.id
                ? 'bg-[#6B8E6B] scale-125'
                : 'bg-[#D4E5D4] hover:bg-[#6B8E6B]/50'
            }`}
            animate={{
              scale: activeSection === section.id ? 1.25 : 1,
            }}
            transition={{ duration: 0.3 }}
          />

          {/* Label tooltip */}
          <motion.span
            className="absolute right-6 bg-white px-3 py-1.5 rounded-lg text-xs font-medium text-[#1E2E1E] shadow-lg whitespace-nowrap pointer-events-none"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
            style={{ opacity: 0 }}
          >
            {section.label}
          </motion.span>
        </motion.button>
      ))}
    </div>
  );
};
