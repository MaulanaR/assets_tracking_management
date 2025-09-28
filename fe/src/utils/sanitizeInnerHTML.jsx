import React from 'react';

// Function untuk sanitasi HTML sederhana (tanpa library eksternal)
const sanitizeInnerHTML = (html) => {
  if (!html) return '';

  // Remove potentially dangerous scripts and events
  let sanitized = html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi, '') // Remove link tags
    .replace(/<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi, '') // Remove meta tags
    .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers like onclick, onload, etc.
    .replace(/javascript:/gi, '') // Remove javascript: protocols
    .replace(/vbscript:/gi, '') // Remove vbscript: protocols
    .replace(/data:/gi, '') // Remove data: protocols
    .replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '') // Remove form tags
    .replace(/<input\b[^<]*(?:(?!<\/input>)<[^<]*)*<\/input>/gi, '') // Remove input tags
    .replace(/<button\b[^<]*(?:(?!<\/button>)<[^<]*)*<\/button>/gi, '') // Remove button tags
    .replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '') // Remove select tags
    .replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, ''); // Remove textarea tags

  return sanitized;
};

// Function untuk menampilkan HTML dengan aman
const SafeInnerHTMLDisplay = ({ htmlContent, classNameWrapper = '' }) => {
  if (!htmlContent) return null;

  // Sanitasi HTML untuk mencegah XSS attacks
  const sanitizedHTML = sanitizeInnerHTML(htmlContent);

  return (
    <div
      className={classNameWrapper}
      dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
      style={{
        maxWidth: '100%',
        overflow: 'auto',
        wordWrap: 'break-word',
      }}
    />
  );
};

export default SafeInnerHTMLDisplay;
