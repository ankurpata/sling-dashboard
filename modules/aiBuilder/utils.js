import React from 'react';
import {
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useContext,
} from 'react';
import {createScope} from './config';

class CodeUtils {
  static cleanCode(response) {
    try {
      const {code: rawCode, dependencies} = response;
      const unescapedCode = rawCode.replace(/\\n/g, '\n').replace(/\\"/g, '"');

      const scope = createScope({
        React,
        useState,
        useEffect,
        useCallback,
        useMemo,
        useRef,
        useContext,
        dependencies
      });

      return {
        code: `
        // Component Definition
        ${unescapedCode.trim()}

        // Render the component
        render(<PreviewComponent />);`,
        scope,
      };
    } catch (error) {
      console.error('Error cleaning code:', error);
      return {code: response, scope: {React}};
    }
  }

  static transformCode(code) {
    // First check if the code already has a render statement
    if (code.includes('render(')) {
      return code;
    }

    // If it's a component definition, wrap it with ThemedComponent
    if (code.includes('const') || code.includes('function')) {
      return `
${code}

render(
  <ThemedComponent>
    <PreviewComponent />
  </ThemedComponent>
);`;
    }

    // If it's just JSX, wrap it directly
    return `
render(
  <ThemedComponent>
    ${code}
  </ThemedComponent>
);`;
  }

  // We can add more utility methods here
  static validateCode(code) {
    // Add code validation logic
    return {
      isValid: true,
      errors: []
    };
  }

  static formatCode(code) {
    // Add code formatting logic
    return code.trim();
  }
}

export default CodeUtils;
