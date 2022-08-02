import React from 'react';

export const CodeBlock = ({ children }) => {
  return (
    <div>
      <h3>Custom CodeBlock Title</h3>
      <div>
        {children}
      </div>
    </div>
  )
}