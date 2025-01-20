import React from 'react';
import AppPage from '../@sling/hoc/AppPage';
import asyncComponent from '../@sling/utility/asyncComponent';
import Box from '@material-ui/core/Box';

const AIBuilder = asyncComponent(() => import('../modules/aiBuilder'));

const AIBuilderPage = () => {
  return <AIBuilder />;
};

export default AppPage(() => <AIBuilderPage />);
