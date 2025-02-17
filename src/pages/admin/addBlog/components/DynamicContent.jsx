import React from 'react';
import DOMPurify from 'dompurify';

const DynamicContent = ({ content }) => {
  // Sanitize the incoming HTML content using DOMPurify
  const sanitizedContent = DOMPurify.sanitize(content);

  return (
    <div
      // Render the sanitized content inside the div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
    />
  );
};

export default DynamicContent;
