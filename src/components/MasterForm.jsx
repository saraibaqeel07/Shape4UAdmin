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
  Avatar 
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Add as AddIcon, Edit, Delete, Upload } from '@mui/icons-material';
import { useState } from 'react';

const MasterForm = ({ 
  title,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  apiEndpoint 
}) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ 
    title: '', 
    description: '', 
    logo: null 
  });
  const [editId, setEditId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');

  const columns = [
    { 
      field: 'logo', 
      headerName: 'Logo', 
      width: 100,
      renderCell: (params) => (
        <Avatar 
          src={params.value} 
          alt={params.row.title}
          variant="rounded"
          sx={{ width: 40, height: 40 }}
        >
          {params.row.title[0]}
        </Avatar>
      )
    },
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'description', headerName: 'Description', flex: 2 },
    { field: 'isApproved', headerName: 'Approved', width: 100 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <Edit />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <Delete />
          </IconButton>
        </Box>
      )
    }
  ];

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ title: '', description: '', logo: null });
    setPreviewUrl('');
    setEditId(null);
  };

  const handleEdit = (item) => {
    setFormData({ 
      title: item.title, 
      description: item.description,
      logo: null
    });
    setPreviewUrl(item.logo);
    setEditId(item._id);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (editId) {
      await onEdit(editId, formData);
    } else {
      await onAdd(formData);
    }
    handleClose();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      await onDelete(id);
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{title}</Typography>
        <Button 
          variant="contained" 
          startIcon={<AddIcon />}
          onClick={() => setOpen(true)}
        >
          Add {title.slice(0, -1)}
        </Button>
      </Box>

      <DataGrid 
        rows={data}
        columns={columns}
        loading={loading}
        autoHeight
        getRowId={(row) => row._id}
        pageSize={10}
      />

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editId ? `Edit ${title.slice(0, -1)}` : `Add ${title.slice(0, -1)}`}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, mb: 2 }}>
            {previewUrl && (
              <Avatar 
                src={previewUrl}
                alt="Preview"
                variant="rounded"
                sx={{ width: 100, height: 100, mb: 2 }}
              />
            )}
            <Button
              variant="outlined"
              component="label"
              startIcon={<Upload />}
              sx={{ mb: 2 }}
            >
              Upload Logo
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleFileChange}
              />
            </Button>
          </Box>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editId ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MasterForm; 