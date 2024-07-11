import React, { useState, useEffect } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

export default function MyWorkspace() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/images')  // 确保URL指向Flask服务器
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  return (
    <div>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        My Workspace
      </Typography>
      <List>
        {images.map((item, index) => (
          <ListItem key={index}>
            <ListItemText primary={item.title} secondary={`by: ${item.author}`} />
          </ListItem>
        ))}
      </List>
    </div>
  );
}
