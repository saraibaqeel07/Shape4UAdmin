import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Box, 
  Typography, 
  Card, 
  CardContent,
  Grid,
  Skeleton,
} from '@mui/material';
import DashboardLayout from '@/layouts/DashboardLayout';
// import axios from '@/lib/axios';
import { format } from 'date-fns';
import api from '../../services/api';

const UserDetails = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/admin/users/${id}`);
        setUser(response.data.data);
      } catch (error) {
        console.log('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading) {
    return (
      <DashboardLayout>
        <Skeleton variant="rectangular" height={200} />
      </DashboardLayout>
    );
  }

  if (!user) {
    return (
      <DashboardLayout>
        <Typography>User not found</Typography>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Typography variant="h5" sx={{ mb: 3 }}>User Details</Typography>
      
      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Name</Typography>
              <Typography variant="body1">{user.name}</Typography>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Email</Typography>
              <Typography variant="body1">{user.email}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Role</Typography>
              <Typography variant="body1">{user.role}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Status</Typography>
              <Typography variant="body1">{user.status}</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <Typography variant="subtitle2" color="text.secondary">Joined Date</Typography>
              <Typography variant="body1">
                {format(new Date(user.createdAt), 'MMM dd, yyyy')}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default UserDetails; 