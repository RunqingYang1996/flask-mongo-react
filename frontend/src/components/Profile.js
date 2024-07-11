import React from 'react';
import Typography from '@mui/material/Typography';

export default function Profile() {
  return (
    <div>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        Profile
      </Typography>
      <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
        Author: Runqing_Yang
        {/* 可以在这里添加更多作者信息 */}
      </Typography>
    </div>
  );
}
