import React from 'react';
import Typography from '@mui/material/Typography';

export default function Logout() {
  return (
    <div>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        Logout
      </Typography>
      <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
        You have been logged out.
      </Typography>
    </div>
  );
}
