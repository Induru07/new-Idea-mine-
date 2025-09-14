import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { tripService } from '../services/api';

const categories = ['Beach', 'Mountain', 'City', 'Historical', 'Adventure', 'Nature', 'Cultural'];

const TripForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    destination: '',
    startDate: '',
    endDate: '',
    description: '',
    category: '',
    photos: []
  });
  const [existingPhotos, setExistingPhotos] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    onDrop: acceptedFiles => {
      setFormData(prev => ({
        ...prev,
        photos: [...prev.photos, ...acceptedFiles]
      }));
    }
  });

  useEffect(() => {
    if (id) {
      fetchTrip();
    }
  }, [id]);

  const fetchTrip = async () => {
    try {
      const trip = await tripService.getTrip(id);
      setFormData({
        destination: trip.destination,
        startDate: trip.startDate.split('T')[0],
        endDate: trip.endDate.split('T')[0],
        description: trip.description,
        category: trip.category,
        photos: []
      });
      setExistingPhotos(trip.photos);
    } catch (error) {
      setError('Error loading trip');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await tripService.updateTrip(id, { ...formData, existingPhotos });
      } else {
        await tripService.createTrip(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving trip');
    }
  };

  const removePhoto = (index, isExisting = false) => {
    if (isExisting) {
      setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      setFormData(prev => ({
        ...prev,
        photos: prev.photos.filter((_, i) => i !== index)
      }));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>
        {id ? 'Edit Trip' : 'Add New Trip'}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              label="Destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="Start Date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              type="date"
              label="End Date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                required
                name="category"
                value={formData.category}
                onChange={handleChange}
                label="Category"
              >
                {categories.map(category => (
                  <MenuItem key={category} value={category}>{category}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              fullWidth
              multiline
              rows={4}
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box
              {...getRootProps()}
              sx={{
                border: '2px dashed #ccc',
                borderRadius: 1,
                p: 2,
                textAlign: 'center',
                cursor: 'pointer',
                mb: 2
              }}
            >
              <input {...getInputProps()} />
              <Typography>
                Drag and drop photos here, or click to select files
              </Typography>
            </Box>
          </Grid>
          
          {/* Display existing photos */}
          {existingPhotos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>Existing Photos</Typography>
              <Grid container spacing={1}>
                {existingPhotos.map((photo, index) => (
                  <Grid item key={index} xs={4} sm={3} md={2}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={photo}
                        alt={`Trip ${index + 1}`}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removePhoto(index, true)}
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        ×
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          {/* Display new photos */}
          {formData.photos.length > 0 && (
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ mb: 2 }}>New Photos</Typography>
              <Grid container spacing={1}>
                {formData.photos.map((photo, index) => (
                  <Grid item key={index} xs={4} sm={3} md={2}>
                    <Box sx={{ position: 'relative' }}>
                      <img
                        src={URL.createObjectURL(photo)}
                        alt={`Upload ${index + 1}`}
                        style={{ width: '100%', height: 'auto' }}
                      />
                      <Button
                        size="small"
                        color="error"
                        onClick={() => removePhoto(index)}
                        sx={{ position: 'absolute', top: 0, right: 0 }}
                      >
                        ×
                      </Button>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Grid>
          )}

          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/dashboard')}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
              >
                {id ? 'Update Trip' : 'Create Trip'}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default TripForm;
