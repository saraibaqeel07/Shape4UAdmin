import { useState, useEffect } from 'react';
import { 
  Box, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Switch,
  Tooltip,
  Chip,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  CircularProgress,
  Avatar,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { 
  Add as AddIcon, 
  Edit, 
  Delete, 
  Search, 
  Visibility, 
  VisibilityOff,
  AdminPanelSettings,
  SupervisorAccount,
  Close
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';
import DataGrid from '@/components/DataGrid';
import { colors } from '@/theme';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

const Admins = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [pagination, setPagination] = useState({
    totalCount: 0,
    currentPage: 1,
    totalPages: 1
  });
  const [filters, setFilters] = useState({
    role: '',
    status: '',
    page: 1,
    limit: 10
  });
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    fromPortal:true,
    role: 'subAdministrator',
    userType: 'subAdministrator',
deviceType:'web',
    permissions: {
      users: false,
      publishers: false,
      books: false,
      categoryTypes:false,
      transactions: false,
      helpCenter: false,
      settings: false,
      contacts: false,
      admins: false,faq:false
    },
    isBlocked: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  const columns = [
    { 
      field: 'name', 
      headerName: 'Name', 
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Avatar 
            sx={{ 
              width: 32, 
              height: 32, 
              bgcolor: params.row.role === 'admin' ? colors.primary : colors.darkGrey
            }}
          >
            {params.row.name?.charAt(0)?.toUpperCase() || 'A'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {params.row.name}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {params.row.email}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'role', 
      headerName: 'Role', 
      width: 120,
      renderCell: (params) => (
        <Chip 
          icon={params.value === 'admin' ? <AdminPanelSettings fontSize="small" /> : <SupervisorAccount fontSize="small" />}
          label={params.value === 'admin' ? 'Admin' : 'Subadmin'} 
          size="small"
          sx={{ 
            bgcolor: params.value === 'admin' ? colors.lightPurple : '#f5f5f5',
            color: params.value === 'admin' ? colors.primary : colors.darkGrey,
            fontWeight: 500
          }}
        />
      )
    },
    {
      field: 'permissions',
      headerName: 'Permissions',
      flex: 1,
      renderCell: (params) => {
        const permissionCount = params.row.permissions ? 
          Object.values(params.row.permissions).filter(Boolean).length : 0;
        
        return (
          <Box>
            {params.row.role === 'admin' ? (
              <Chip 
                label="Full Access" 
                size="small"
                sx={{ bgcolor: colors.lightPurple, color: colors.primary }}
              />
            ) : (
              <Chip 
                label={`${permissionCount} modules`} 
                size="small"
                sx={{ bgcolor: '#f5f5f5', color: colors.darkGrey }}
              />
            )}
          </Box>
        );
      }
    },
    { 
      field: 'isActive', 
      headerName: 'Status', 
      width: 120,
      renderCell: (params) => (
        <Tooltip title={params.value ? 'Active' : 'Inactive'}>
          <Switch
            checked={params.value}
            onChange={() => handleStatusToggle(params.row._id, params.value)}
            disabled={params.row._id === user?._id} // Can't deactivate yourself
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: 'success.main',
                '&:hover': {
                  backgroundColor: 'success.lighter'
                }
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: 'success.main'
              }
            }}
          />
        </Tooltip>
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton 
            onClick={() => handleEdit(params.row)}
            disabled={params.row.role === 'admin' && user?.role !== 'admin'} // Subadmins can't edit admins
          >
            <Edit />
          </IconButton>
          <IconButton 
            onClick={() => setConfirmDelete(params.row)}
            disabled={params.row._id === user?._id} // Can't delete yourself
          >
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/list', {
        params: {
          name: searchText,
          sortBy,
          sortOrder,
          ...filters
        }
      });
      
      if (response.data?.data) {
        setAdmins(response.data.data);
        
        // Update pagination data if available
        if (response.data?.pagination) {
          setPagination({
            totalCount: response.data.pagination.totalCount || 0,
            currentPage: response.data.pagination.currentPage || 1,
            totalPages: response.data.pagination.totalPages || 1
          });
        }
      }
    } catch (error) {
      console.log('Error fetching admins:', error);
      enqueueSnackbar('Error fetching admins', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [searchText, sortBy, sortOrder, filters]);

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/update-status`, {
        isBlocked: !currentStatus,adminId:id
      });
      enqueueSnackbar('Status updated successfully', { variant: 'success' });
      fetchAdmins();
    } catch (error) {
      enqueueSnackbar('Error updating status', { variant: 'error' });
    }
  };

  const handleEdit = (admin) => {
    setSelectedAdmin(admin);
    setFormData({
      name: admin.name || '',
      email: admin.email || '',
      fromPortal:true,
      password: '', // Don't populate password for security
      role: admin.role || 'subAdministrator',
      deviceType:'web',
      permissions: admin.permissions || {
        users: false,
        publishers: false,
        books: false,
        categoryTypes:false,
        transactions: false,
        helpCenter: false,
        settings: false,
        contacts: false,
        admins: false,faq:false
      },
      isBlocked: admin.isBlocked 
    });
    setEditDialogOpen(true);
  };

  const handleAdd = () => {
    setSelectedAdmin(null);
    setFormData({
      name: '',
      email: '',
      password: 'Assd@123',
      fromPortal:true,
      role: 'subAdministrator',
      userType: 'subAdministrator',
      deviceType:'web',
      permissions: {
        users: false,
        publishers: false,
        books: false,
        categoryTypes:false,
        transactions: false,
        helpCenter: false,
        settings: false,
        contacts: false,
        admins: false,faq:false,dashboard:false
      },
      isBlocked: false
    });
    setEditDialogOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Validate form
      if (!formData.name || !formData.email) {
        enqueueSnackbar('Name and email are required', { variant: 'error' });
        return;
      }

      if (!selectedAdmin && !formData.password) {
        enqueueSnackbar('Password is required for new admins', { variant: 'error' });
        return;
      }

      // Prepare data - only include password if it's provided for updates
      const dataToSend = { ...formData };
      if (selectedAdmin && !dataToSend.password) {
        delete dataToSend.password;
      }

      if (selectedAdmin) {
        // Update existing admin
        await api.patch(`/admin/update/${selectedAdmin._id}`, dataToSend);
        enqueueSnackbar('Admin updated successfully', { variant: 'success' });
      } else {
        // Create new admin
        await api.post('/admin/add-admin', dataToSend);
        enqueueSnackbar('Admin created successfully', { variant: 'success' });
      }

      setEditDialogOpen(false);
      fetchAdmins();
    } catch (error) {
      console.log('Error saving admin:', error);
      enqueueSnackbar(error.response?.data?.message || 'Error saving admin', { 
        variant: 'error' 
      });
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    
    try {
      await api.delete(`/admin/delete/${confirmDelete._id}`);
      enqueueSnackbar('Admin deleted successfully', { variant: 'success' });
      setConfirmDelete(null);
      fetchAdmins();
    } catch (error) {
      enqueueSnackbar('Error deleting admin', { variant: 'error' });
    }
  };

  const handlePageChange = (event, newPage) => {
    setFilters(prev => ({
      ...prev,
      page: newPage
    }));
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
      page: 1 // Reset to page 1 when filter changes
    }));
  };

  const handlePermissionChange = (module) => {
    setFormData(prev => ({
      ...prev,
      permissions: {
        ...prev.permissions,
        [module]: !prev.permissions[module]
      }
    }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography
          variant="h5"
          sx={{ color: colors.dimBlack, fontWeight: 600 }}
        >
          Admins & Subadmins
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: colors.primary,
            '&:hover': {
              bgcolor: colors.darkPurple
            }
          }}
        >
          Add Admin
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              placeholder="Search by name or email..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "white",
                  "&:hover fieldset": {
                    borderColor: colors.primary,
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: colors.primary,
                  },
                },
              }}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={filters.role}
                    label="Role"
                    onChange={(e) => handleFilterChange('role', e.target.value)}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="administrator">Admin</MenuItem>
                    <MenuItem value="subAdministrator">Subadmin</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filters.status}
                    label="Status"
                    onChange={(e) => handleFilterChange('status', e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>

      <DataGrid
        rows={admins}
        columns={columns}
        loading={loading}
        pageSize={filters.limit}
        page={filters.page}
        pageCount={pagination.totalPages}
        onPageChange={handlePageChange}
        getRowId={(row) => row._id}
        noDataMessage="No admins found"
      />

      {/* Edit/Add Dialog */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: colors.lightPurple,
          color: colors.primary
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {selectedAdmin ? 'Edit Admin' : 'Add New Admin'}
          </Typography>
          <IconButton onClick={() => setEditDialogOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 3 }}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Basic Information
                </Typography>
                <TextField
                  label="Name"
                  fullWidth
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  margin="normal"
                  required
                />
                <TextField
                  label="Email"
                  type="email"
                  fullWidth
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  margin="normal"
                  required
                />
                <TextField
                  label={selectedAdmin ? "New Password (leave blank to keep current)" : "Password"}
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  margin="normal"
                  required={!selectedAdmin}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {/* <FormControl fullWidth margin="normal">
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={formData.role}
                    label="Role"
                    onChange={(e) => setFormData(prev => ({ 
                      ...prev, 
                      role: e.target.value,
                      // If role is admin, all permissions are implicitly granted
                      permissions: e.target.value === 'administrator' ? Object.keys(prev.permissions).reduce((acc, key) => {
                        acc[key] = true;
                        return acc;
                      }, {}) : prev.permissions
                    }))}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="subadmin">Subadmin</MenuItem>
                  </Select>
                </FormControl> */}
                <FormControlLabel
                  control={
                    <Switch
                      checked={!formData.isBlocked}
                      onChange={(e) => setFormData(prev => ({ ...prev, isBlocked: !e.target.checked }))}
                      sx={{
                        '& .MuiSwitch-switchBase.Mui-checked': {
                          color: 'success.main',
                          '&:hover': {
                            backgroundColor: 'success.lighter'
                          }
                        },
                        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                          backgroundColor: 'success.main'
                        }
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: !formData.isBlocked ? 'success.main' : 'text.secondary' }}>
                      {!formData.isBlocked ? 'Active' : 'Inactive'}
                    </Typography>
                  }
                  sx={{ mt: 2 }}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box>
                <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
                  Permissions
                </Typography>
                {formData.role === 'admin' ? (
                  <Alert severity="info" sx={{ mb: 2 }}>
                    Admins have full access to all modules
                  </Alert>
                ) : (
                  <Box sx={{ 
                    border: `1px solid ${colors.lightGrey}`, 
                    borderRadius: 1, 
                    p: 2,
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    <Grid container spacing={2}>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.users}
                              onChange={() => handlePermissionChange('users')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Users"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.publishers}
                              onChange={() => handlePermissionChange('publishers')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Publishers"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.books}
                              onChange={() => handlePermissionChange('books')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Books"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.categoryTypes}
                              onChange={() => handlePermissionChange('categoryTypes')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Category Types"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.admins}
                              onChange={() => handlePermissionChange('admins')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Admins"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.settings}
                              onChange={() => handlePermissionChange('settings')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Book Types"
                        />
                        
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.dashboard}
                              onChange={() => handlePermissionChange('dashboard')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Dashboard"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.transactions}
                              onChange={() => handlePermissionChange('transactions')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Transactions"
                        />
                      </Grid>
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.contacts}
                              onChange={() => handlePermissionChange('contacts')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Contacts"
                        />
                      </Grid>
                    
                     
                      <Grid item xs={6}>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={formData.permissions.settings}
                              onChange={() => handlePermissionChange('settings')}
                              sx={{
                                '& .MuiSwitch-switchBase.Mui-checked': {
                                  color: colors.primary,
                                }
                              }}
                            />
                          }
                          label="Settings"
                        />
                      </Grid>
                    
                     
                    </Grid>
                  </Box>
                )}
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setEditDialogOpen(false)} sx={{ color: colors.darkGrey }}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: colors.primary,
              '&:hover': {
                bgcolor: colors.darkPurple
              }
            }}
          >
            {selectedAdmin ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Confirm Delete Dialog */}
      <Dialog
        open={Boolean(confirmDelete)}
        onClose={() => setConfirmDelete(null)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle sx={{ color: 'error.main' }}>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the admin <strong>{confirmDelete?.name}</strong>?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(null)}>
            Cancel
          </Button>
          <Button 
            onClick={handleDelete}
            variant="contained" 
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Admins;