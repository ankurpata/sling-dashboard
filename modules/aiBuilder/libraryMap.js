import React, { 
  useState, 
  useEffect, 
  useCallback, 
  useMemo, 
  useRef,
  useContext
} from 'react';
import * as MaterialUI from '@material-ui/core';
import * as MaterialIcons from '@material-ui/icons';
import * as MaterialLab from '@material-ui/lab';
import * as MaterialStyles from '@material-ui/core/styles';

// Helper function to clean and process imports
export const processImports = (unescapedCode) => {
  // Create scope with all available components and hooks
  const scope = {
    React,
    // React hooks
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useContext,
    // Material-UI styles
    makeStyles: MaterialStyles.makeStyles,
    useTheme: MaterialStyles.useTheme,
    styled: MaterialStyles.styled,
    // Add all Material-UI components directly
    ...MaterialUI,
    ...MaterialIcons,
    ...MaterialLab
  };

  return scope;
};
