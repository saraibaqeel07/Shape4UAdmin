import { useState, useEffect } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Typography,
  Switch,
  Button,
  Chip,
  MenuItem,
  Pagination,
  Tooltip,
  Stack,
} from "@mui/material";
import { Edit, Delete, EventNote } from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { colors } from "@/theme";
import api from "@/services/api";
import { format } from "date-fns";
import DataGrid from "../../components/DataGrid";
import CustomButton from "../../components/common/Button";
import Input from "../../components/common/input";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    role: "",
    isActive: "",
    page: 1,
    limit: 10,
  });

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });

  // Dialog States
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Form States
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    role: "",
  });
  const [selectedDate, setSelectedDate] = useState("");

  const { enqueueSnackbar } = useSnackbar();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/users", { params: filters });

      if (response.data.success) {
        const { users, total, pages, currentPage } = response.data.data;
        setUsers(users);
        setPagination({ total, pages, currentPage });
      }
    } catch (error) {
      enqueueSnackbar("Error fetching users", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const handleFilterChange = (field) => (event) => {
    setFilters((prev) => ({
      ...prev,
      [field]: event.target.value,
      ...(field !== "page" && { page: 1 }),
    }));
  };

  const handleStatusToggle = async (id, currentStatus) => {
    try {
      await api.patch(`/admin/users/${id}/status`, {
        isActive: !currentStatus,
      });
      enqueueSnackbar("Status updated successfully", { variant: "success" });
      fetchUsers();
    } catch (error) {
      enqueueSnackbar("Error updating status", { variant: "error" });
    }
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditForm({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "USER",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async () => {
    try {
      const response = await api.put(
        `/admin/users/${selectedUser.id}`,
        editForm,
      );
      if (response.data.success) {
        enqueueSnackbar("User updated successfully", { variant: "success" });
        fetchUsers();
        setEditDialogOpen(false);
      }
    } catch (error) {
      enqueueSnackbar("Error updating user", { variant: "error" });
    }
  };

  // Logic to open Date Picker Dialog
  const handleDateOpen = (user) => {
    setSelectedUser(user);
    // Initialize with existing date or today
    const currentStart = user.startDate
      ? format(new Date(user.startDate), "yyyy-MM-dd")
      : format(new Date(), "yyyy-MM-dd");
    setSelectedDate(currentStart);
    setDateDialogOpen(true);
  };

  const handleDateSubmit = async () => {
    try {
      const response = await api.post("/admin/users/update-start-date", {
        userId: selectedUser.id,
        startDate: selectedDate,
      });
      if (response.data.success) {
        enqueueSnackbar("Start date updated", { variant: "success" });
        fetchUsers();
        setDateDialogOpen(false);
      }
    } catch (error) {
      enqueueSnackbar("Failed to update date", { variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await api.delete(`/admin/users/${id}`);
        fetchUsers();
        enqueueSnackbar("User deleted successfully", { variant: "success" });
      } catch (error) {
        enqueueSnackbar("Error deleting user", { variant: "error" });
      }
    }
  };

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 200,
      flex: 1,
      valueGetter: (params) =>
        `${params.row.firstName || ""} ${params.row.lastName || ""}`,
    },
    { field: "email", headerName: "Email", width: 250, flex: 1 },
    {
      field: "startDate",
      headerName: "Program Start",
      width: 150,
      valueFormatter: (params) =>
        params.value
          ? format(new Date(params.value), "MMM dd, yyyy")
          : "Not Started",
    },
    {
      field: "role",
      headerName: "Role",
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          size="small"
          sx={{
            fontWeight: 600,
            textTransform: "uppercase",
            bgcolor: params.value === "ADMIN" ? colors.lightPurple : "#f0f0f0",
            color: params.value === "ADMIN" ? colors.primary : "#666",
          }}
        />
      ),
    },
    {
      field: "isActive",
      headerName: "Status",
      width: 100,
      renderCell: (params) => (
        <Switch
          checked={params.value}
          onChange={() => handleStatusToggle(params.row.id, params.value)}
          sx={{
            "& .MuiSwitch-switchBase.Mui-checked": {
              color: "#7FB33B",
            },
            "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
              backgroundColor: "#7FB33B",
            },
          }}
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 180,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit Profile">
            <IconButton onClick={() => handleEdit(params.row)} color="primary">
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Set Start Date">
            <IconButton
              onClick={() => handleDateOpen(params.row)}
              sx={{ color: colors.primary }}
            >
              <EventNote fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete User">
            <IconButton
              onClick={() => handleDelete(params.row.id)}
              color="error"
            >
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, width: "100%" }}>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 3,
          fontFamily: '"ArialRounded", Arial, sans-serif',
        }}
      >
        User Management
      </Typography>

      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          border: `1px solid ${colors.lightGrey}`,
          overflow: "hidden",
           overflowX: "auto",
          width: "100%",
        }}
      >
        <DataGrid
          rows={users}
          columns={columns}
          loading={loading}
          getRowId={(row) => row.id}
          hideFooterPagination
          autoHeight
          sx={{
            width: "100%",

            "& .MuiDataGrid-root": {
              fontFamily: '"Montserrat", sans-serif',
            },

            "& .MuiDataGrid-cell": {
              fontFamily: '"Montserrat", sans-serif',
            },

            "& .MuiDataGrid-columnHeaders": {
              fontFamily: '"Montserrat", sans-serif',
              fontWeight: 600,
            },
          }}
        />
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Total {pagination.total} users
          </Typography>
          <Pagination
            count={pagination.pages}
            page={pagination.currentPage}
            onChange={(e, p) =>
              handleFilterChange("page")({ target: { value: p } })
            }
            sx={{
              "& .MuiPaginationItem-root": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: "36px",
                height: "36px",
                borderRadius: "50px",
              },

              "& .MuiPaginationItem-root.Mui-selected": {
                backgroundColor: "#7FB33B",
                color: "#fff",
                fontWeight: 600,
              },

              "& .MuiPaginationItem-root.Mui-selected:hover": {
                backgroundColor: "#6aa52f",
              },
            }}
          />
        </Box>
      </Box>

      {/* EDIT PROFILE DIALOG */}
      <Dialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Edit User Profile
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Input
              label="First Name"
              fullWidth
              value={editForm.firstName}
              onChange={(e) =>
                setEditForm({ ...editForm, firstName: e.target.value })
              }
            />
            <Input
              label="Last Name"
              fullWidth
              value={editForm.lastName}
              onChange={(e) =>
                setEditForm({ ...editForm, lastName: e.target.value })
              }
            />
            <Input
              select
              label="Role"
              fullWidth
              value={editForm.role}
              onChange={(e) =>
                setEditForm({ ...editForm, role: e.target.value })
              }
            >
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Input>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setEditDialogOpen(false)}
            sx={{
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <CustomButton
            onClick={handleEditSubmit}
            text={"Save Changes"}
            fullWidth={false}
          />
        </DialogActions>
      </Dialog>

      {/* UPDATE START DATE DIALOG */}
      <Dialog
        open={dateDialogOpen}
        onClose={() => setDateDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontFamily: '"Montserrat", sans-serif',
          }}
        >
          Adjust Program Start Date
        </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="body2"
            sx={{
              mb: 3,
              color: "text.secondary",
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Setting the start date for{" "}
            <strong>{selectedUser?.firstName}</strong> will determine which week
            of the program they are currently seeing.
          </Typography>
          <Input
            label="Start Date"
            type="date"
            fullWidth
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDateDialogOpen(false)}
            sx={{
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <CustomButton
            onClick={handleDateSubmit}
            text={" Update Start Date"}
            fullWidth={false}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Users;
