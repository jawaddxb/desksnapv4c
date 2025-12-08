
import { Presentation, Theme, Slide } from '../types';

declare const PptxGenJS: any;

// --- HELPERS ---

const getFont = (fontString: string) => fontString.split(',')[0].replace(/['"]/g, '');

const getFontSize = (type: 'heading' | 'body', layout: string, scale?: string) => {
    if (type === 'heading') {
        if (scale === 'hero') return 72;
        if (scale === 'compact') return 24;
        if (scale === 'classic') return 44;
        if (layout === 'statement') return 56;
        if (layout === 'full-bleed') return 48;
        if (layout === 'card') return 40;
        return 36;
    } else {
        if (scale === 'hero') return 24;
        if (scale === 'compact') return 12;
        if (layout === 'statement') return 18;
        if (layout === 'gallery') return 12;
        return 16;
    }
};

const commonTextProps = (theme: Theme, slide: Slide, type: 'heading' | 'body') => ({
    fontFace: getFont(type === 'heading' ? theme.fonts.heading : theme.fonts.body),
    color: theme.colors.text,
    bold: type === 'heading',
    fontSize: getFontSize(type, slide.layoutType, slide.fontScale),
    lineSpacing: type === 'body' ? 24 : undefined,
    bullet: type === 'body'
});

// --- LAYOUT STRATEGIES ---

const layoutGenerators: Record<string, (pptSlide: any, slide: Slide, theme: Theme) => void> = {
    'full-bleed': (pptSlide, slide, theme) => {
        if (slide.imageUrl) pptSlide.addImage({ path: slide.imageUrl, x: 0, y: 0, w: '100%', h: '100%' });
        pptSlide.addShape('rect', { x: 0, y: 0, w: '100%', h: '100%', fill: { color: theme.colors.surface, transparency: 20 } });
        
        const isCenter = slide.alignment === 'center';
        const isRight = slide.alignment === 'right';
        const align = isCenter ? 'center' : isRight ? 'right' : 'left';
        const xPos = isCenter ? 1 : isRight ? 5 : 0.5;

        pptSlide.addText(slide.title.toUpperCase(), { 
            x: xPos, y: 2, w: isCenter ? 8 : 4.5, align, 
            ...commonTextProps(theme, slide, 'heading'), 
            shadow: { type: 'outer', color: '000000', blur: 5, opacity: 0.3 } 
        });
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { 
            x: xPos, y: 3.5, w: isCenter ? 8 : 4.5, align, color: theme.colors.text 
        });
    },

    'statement': (pptSlide, slide, theme) => {
        pptSlide.addText(slide.title, { 
            x: 1, y: 0.5, w: 8, h: 4, align: 'center', valign: 'middle', 
            ...commonTextProps(theme, slide, 'heading'), fontSize: 60 
        });
        if (slide.content.length > 0) {
             pptSlide.addText(slide.content.join(' • '), { 
                x: 1, y: 4, w: 8, h: 1, align: 'center', 
                ...commonTextProps(theme, slide, 'body'), bullet: false, color: theme.colors.secondary 
            });
        }
        if (slide.imageUrl) pptSlide.addImage({ path: slide.imageUrl, x: 0, y: 5, w: '100%', h: 2.5, sizing: { type: 'cover', w: '100%', h: 2.5 } });
    },

    'gallery': (pptSlide, slide, theme) => {
        if (slide.imageUrl) {
            pptSlide.addImage({ path: slide.imageUrl, x: 0.5, y: 0.5, w: 9, h: 3.5, sizing: { type: 'cover', w: 9, h: 3.5 } });
            pptSlide.addShape('rect', { x: 0.5, y: 0.5, w: 9, h: 3.5, line: { color: theme.colors.border, width: 1 }, fill: { type: 'none' } });
        }
        pptSlide.addText(slide.title, { x: 0.5, y: 4.2, w: 3, h: 1.2, valign: 'top', ...commonTextProps(theme, slide, 'heading'), fontSize: 24 });
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { 
            x: 4, y: 4.2, w: 5.5, h: 1.2, valign: 'top', color: theme.colors.secondary 
        });
    },

    'card': (pptSlide, slide, theme) => {
        // Full screen background image
        if (slide.imageUrl) pptSlide.addImage({ path: slide.imageUrl, x: 0, y: 0, w: '100%', h: '100%' });
        
        // Floating Card
        const isCenter = slide.alignment === 'center';
        const isRight = slide.alignment === 'right';
        const cardX = isCenter ? 2 : isRight ? 5.5 : 0.5;
        
        // Card Background Shape
        pptSlide.addShape('rect', { 
            x: cardX, y: 1.5, w: 4.5, h: 4, 
            fill: { color: theme.colors.surface, transparency: 10 },
            line: { color: theme.colors.border, width: 1 }
        });
        
        pptSlide.addText(slide.title, { 
            x: cardX + 0.25, y: 1.75, w: 4, h: 1, 
            ...commonTextProps(theme, slide, 'heading'), 
            fontSize: 32, align: isCenter ? 'center' : 'left'
        });
        
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { 
            x: cardX + 0.25, y: 2.75, w: 4, h: 2.5, 
            align: isCenter ? 'center' : 'left'
        });
    },

    'horizontal': (pptSlide, slide, theme) => {
        // 50/50 Horizontal Split
        if (slide.imageUrl) {
            pptSlide.addImage({ path: slide.imageUrl, x: 0, y: 0, w: '100%', h: '45%', sizing: { type: 'cover', w: '100%', h: '45%' } });
        }
        pptSlide.addText(slide.title, { 
            x: 0.5, y: 3.5, w: 9, h: 1, align: 'center',
            ...commonTextProps(theme, slide, 'heading') 
        });
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { 
            x: 1, y: 4.5, w: 8, h: 2, align: 'center'
        });
    },

    'magazine': (pptSlide, slide, theme) => {
        const isRight = slide.alignment === 'right';
        
        // Image Column (35% width)
        if (slide.imageUrl) {
            pptSlide.addImage({ 
                path: slide.imageUrl, 
                x: isRight ? 6.5 : 0, y: 0, w: 3.5, h: '100%', 
                sizing: { type: 'cover', w: 3.5, h: '100%' } 
            });
        }
        
        // Content Area (65% width)
        const textX = isRight ? 0.5 : 4;
        pptSlide.addText(slide.title, { 
            x: textX, y: 1, w: 5.5, h: 1.5, valign: 'bottom',
            ...commonTextProps(theme, slide, 'heading') 
        });
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { 
            x: textX, y: 2.5, w: 5.5, h: 4, valign: 'top' 
        });
    },

    'split': (pptSlide, slide, theme) => {
        const isRight = slide.alignment === 'right';
        if (slide.imageUrl) {
            pptSlide.addImage({ path: slide.imageUrl, x: isRight ? 0.5 : 5.5, y: 1, w: 4, h: 5.625, sizing: { type: 'cover', w: 4, h: 5.625 } });
        }
        const textX = isRight ? 5 : 0.5;
        pptSlide.addText(slide.title, { x: textX, y: 1, w: 4.5, h: 1.5, valign: 'bottom', ...commonTextProps(theme, slide, 'heading') });
        pptSlide.addText(slide.content.map(c => ({ text: c, options: commonTextProps(theme, slide, 'body') })), { x: textX, y: 2.5, w: 4.5, h: 4, valign: 'top' });
    }
};

// --- MAIN EXPORT ---

export const generatePPT = async (presentation: Presentation, theme: Theme) => {
  if (typeof PptxGenJS === 'undefined') { console.error('PptxGenJS not loaded'); return; }

  const pres = new PptxGenJS();
  pres.title = presentation.topic;
  pres.subject = presentation.topic;
  pres.layout = 'LAYOUT_16x9';

  for (const slide of presentation.slides) {
    const pptSlide = pres.addSlide();
    pptSlide.background = { color: theme.colors.background };
    if (slide.speakerNotes) pptSlide.addNotes(slide.speakerNotes);

    const generator = layoutGenerators[slide.layoutType] || layoutGenerators['split'];
    generator(pptSlide, slide, theme);
    
    pptSlide.addText("Generated by DeckSnap AI", { x: 0.2, y: 5.3, w: '100%', h: 0.3, align: 'left', fontSize: 8, color: '999999' });
  }

  const fileName = `${presentation.topic.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_presentation.pptx`;
  await pres.writeFile({ fileName });
};
