import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  ImageList,
  ImageListItem,
} from '@mui/material';
import { tripService } from '../services/api';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const fetchTrip = async () => {
    try {
      const data = await tripService.getTrip(id);
      setTrip(data);
    } catch (err) {
      setError('Error loading trip details');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await tripService.deleteTrip(id);
      navigate('/dashboard');
    } catch (err) {
      setError('Error deleting trip');
    }
    setDeleteDialog(false);
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!trip) return <Typography>Trip not found</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4">{trip.destination}</Typography>
        <Box>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => navigate(`/trips/edit/${id}`)}
            sx={{ mr: 2 }}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setDeleteDialog(true)}
          >
            Delete
          </Button>
        </Box>
      </Box>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Date Range
            </Typography>
            <Typography variant="body1">
              {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle1" color="text.secondary">
              Category
            </Typography>
            <Typography variant="body1">
              {trip.category}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="text.secondary">
              Description
            </Typography>
            <Typography variant="body1">
              {trip.description}
            </Typography>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" sx={{ mb: 2 }}>Photos</Typography>
      <ImageList cols={3} gap={8}>
        {trip.photos.map((photo, index) => (
          <ImageListItem
            key={index}
            sx={{ cursor: 'pointer' }}
            onClick={() => setSelectedImage(photo)}
          >
            <img
              src={photo}
              alt={`Trip to ${trip.destination} ${index + 1}`}
              loading="lazy"
              style={{ height: 200, objectFit: 'cover' }}
            />
          </ImageListItem>
        ))}
      </ImageList>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
      >
        <DialogTitle>Delete Trip</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this trip? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)}>Cancel</Button>
          <Button onClick={handleDelete} color="error">Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Image Preview Dialog */}
      <Dialog
        open={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Trip"
              style={{ width: '100%', height: 'auto' }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedImage(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TripDetail;
