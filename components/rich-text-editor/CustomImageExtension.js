/**
 * CustomImage Extension for TipTap
 * 
 * This extension preserves image styling (float, width, margin, etc.) 
 * when content is saved and loaded. The standard TipTap Image extension
 * only saves src, alt, and title attributes, causing layout styles to be lost.
 * 
 * This extension:
 * 1. Parses inline styles from existing HTML content
 * 2. Stores them as node attributes
 * 3. Renders them back as inline styles in the output HTML
 */

import { Image } from '@tiptap/extension-image';
import { mergeAttributes } from '@tiptap/core';

export const CustomImage = Image.extend({
  name: 'image',
  
  addAttributes() {
    return {
      ...this.parent?.(),
      // Image source
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      alignment: {
        default: null,
        parseHTML: element => {
          const className = element.getAttribute('class') || '';

          if (className.includes('image-left')) return 'left';
          if (className.includes('image-right')) return 'right';
          if (className.includes('image-center')) return 'center';

          const dataAlign = element.getAttribute('data-align');
          if (dataAlign === 'left' || dataAlign === 'right' || dataAlign === 'center') {
            return dataAlign;
          }

          const style = element.getAttribute('style') || '';
          const floatMatch = style.match(/float:\s*(left|right|none)/i);
          if (floatMatch) {
            return floatMatch[1] === 'none' ? 'center' : floatMatch[1].toLowerCase();
          }

          if (/display:\s*block/i.test(style) && /margin:\s*[^;]*auto/i.test(style)) {
            return 'center';
          }

          return null;
        },
        renderHTML: attributes => {
          if (!attributes.alignment) return {};
          return { 'data-align': attributes.alignment };
        },
      },
      // Custom styling attributes for layout control
      float: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const floatMatch = style.match(/float:\s*(left|right|none)/i);
          return floatMatch ? floatMatch[1] : element.getAttribute('data-float') || null;
        },
        renderHTML: attributes => {
          if (!attributes.float) return {};
          return { 'data-float': attributes.float };
        },
      },
      width: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const widthMatch = style.match(/width:\s*([^;]+)/i);
          return widthMatch ? widthMatch[1].trim() : element.getAttribute('width') || null;
        },
        renderHTML: attributes => {
          if (!attributes.width) return {};
          return { width: attributes.width };
        },
      },
      height: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const heightMatch = style.match(/height:\s*([^;]+)/i);
          return heightMatch ? heightMatch[1].trim() : element.getAttribute('height') || null;
        },
        renderHTML: attributes => {
          if (!attributes.height) return {};
          return { height: attributes.height };
        },
      },
      margin: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const marginMatch = style.match(/margin:\s*([^;]+)/i);
          return marginMatch ? marginMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.margin) return {};
          return { 'data-margin': attributes.margin };
        },
      },
      display: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const displayMatch = style.match(/display:\s*([^;]+)/i);
          return displayMatch ? displayMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.display) return {};
          return { 'data-display': attributes.display };
        },
      },
      borderRadius: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const radiusMatch = style.match(/border-radius:\s*([^;]+)/i);
          return radiusMatch ? radiusMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.borderRadius) return {};
          return { 'data-border-radius': attributes.borderRadius };
        },
      },
      border: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const borderMatch = style.match(/border:\s*([^;]+)/i);
          return borderMatch ? borderMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.border) return {};
          return { 'data-border': attributes.border };
        },
      },
      boxShadow: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const shadowMatch = style.match(/box-shadow:\s*([^;]+)/i);
          return shadowMatch ? shadowMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.boxShadow) return {};
          return { 'data-box-shadow': attributes.boxShadow };
        },
      },
      padding: {
        default: null,
        parseHTML: element => {
          const style = element.getAttribute('style') || '';
          const paddingMatch = style.match(/padding:\s*([^;]+)/i);
          return paddingMatch ? paddingMatch[1].trim() : null;
        },
        renderHTML: attributes => {
          if (!attributes.padding) return {};
          return { 'data-padding': attributes.padding };
        },
      },
    };
  },

  renderHTML({ node, HTMLAttributes }) {
    // Build the style string from attributes
    const styles = [];
    const classes = [];
    // Access original attributes directly from the node instead of HTMLAttributes 
    // which contains the transformed keys (like data-float instead of float)
    const attrs = node.attrs;
    const alignment = attrs.alignment || attrs.float || null;

    if (alignment === 'left') {
      classes.push('image-left');
    } else if (alignment === 'right') {
      classes.push('image-right');
    } else if (alignment === 'center') {
      classes.push('image-center');
    }
    
    if (attrs.float && attrs.float !== 'none') {
      styles.push(`float: ${attrs.float}`);
    }
    if (attrs.width) {
      styles.push(`width: ${attrs.width}`);
    } else {
      styles.push('max-width: 100%');
    }
    if (attrs.height && attrs.height !== 'auto') {
      styles.push(`height: ${attrs.height}`);
    } else {
      styles.push('height: auto');
    }
    if (attrs.margin) {
      styles.push(`margin: ${attrs.margin}`);
    } else if (attrs.float === 'left') {
      styles.push('margin: 0 1em 1em 0');
    } else if (attrs.float === 'right') {
      styles.push('margin: 0 0 1em 1em');
    }
    if (attrs.display) {
      styles.push(`display: ${attrs.display}`);
    }
    if (attrs.borderRadius) {
      styles.push(`border-radius: ${attrs.borderRadius}`);
    }
    if (attrs.border) {
      styles.push(`border: ${attrs.border}`);
    }
    if (attrs.boxShadow) {
      styles.push(`box-shadow: ${attrs.boxShadow}`);
    }
    if (attrs.padding) {
      styles.push(`padding: ${attrs.padding}`);
    }
    
    // Merge with existing attributes
    const finalAttrs = {
      ...HTMLAttributes,
      class: classes.join(' '),
      style: styles.length > 0 ? styles.join('; ') : undefined,
    };
    
    // Remove data attributes from final HTML since we've incorporated them into style
    delete finalAttrs['data-align'];
    delete finalAttrs['data-float'];
    delete finalAttrs['data-margin'];
    delete finalAttrs['data-display'];
    delete finalAttrs['data-border-radius'];
    delete finalAttrs['data-border'];
    delete finalAttrs['data-box-shadow'];
    delete finalAttrs['data-padding'];
    
    // Width and height are allowed as standard HTML attributes on img, so we keep them if they exist
    
    return ['img', mergeAttributes(this.options.HTMLAttributes, finalAttrs)];
  },
});

export default CustomImage;
