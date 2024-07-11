import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MyWorkspace() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/images')  // Ensure this URL points to your Flask server
      .then(response => response.json())
      .then(data => setImages(data))
      .catch(error => console.error('Error fetching images:', error));
  }, []);

  const handleDelete = (index) => {
    const newData = images.filter((_, idx) => idx !== index);
    setImages(newData);
  };

  return (
    <div>
      <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
        My Workspace
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Author</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {images.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <img src={`data:image/png;base64,${item.img}`} alt={item.title} width="250" height="150" />
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.author}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleDelete(index)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
