'use client';

import * as React from 'react';
import { CircularProgress, Box } from '@mui/material';

export const Loader = () => {
  return <Box sx={{ width: '100%', display: 'flex' }}><CircularProgress disableShrink sx={{ m: "0 auto", mt: 10 }} /></Box>;
}