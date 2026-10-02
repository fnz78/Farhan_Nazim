import React from 'react';
import { TECH_ITEMS_LIST, TECH_STACK_ICONS } from '../data/techStackIcons';

export const TechStackMarquee = () => {
  // Duplicate array for seamless infinite marquee scrolling
  const marqueeItems = [...TECH_ITEMS_LIST, ...TECH_ITEMS_LIST];

  return (
    <div className="eink-marquee-wrapper" aria-label="Technical Skills Marquee">
      <div className="eink-marquee-track">
        {marqueeItems.map((item, idx) => {
          const iconMarkup = TECH_STACK_ICONS[item.key] || TECH_STACK_ICONS.git;
          return (
            <div
              key={`${item.key}-${idx}`}
              className="tech-marquee-item"
              data-tooltip={item.name}
              aria-label={item.name}
              dangerouslySetInnerHTML={{ __html: iconMarkup }}
            />
          );
        })}
      </div>
    </div>
  );
};
