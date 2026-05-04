import { useState, useEffect } from "react";
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
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import {
  Add,
  Edit,
  Delete,
  CloudUpload,
  Description,
} from "@mui/icons-material";
import { useSnackbar } from "notistack";
import { colors } from "@/theme";
import api from "@/services/api";
import DataGrid from "../../components/DataGrid";
import Input from "../../components/common/input";
import CustomButton from "../../components/common/Button";

const Weeks = () => {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
    currentPage: 1,
  });
  const [limit] = useState(10);

  const { enqueueSnackbar } = useSnackbar();

  const [form, setForm] = useState({
    weekNumber: "",
    title: "",
    introText: "",
  });

  const fetchWeeks = async (page = 1) => {
    try {
      setLoading(true);
      const res = await api.get("/admin/weeks", {
        params: { page, limit },
      });

      if (res.data.success) {
        const { weeks, total, pages, currentPage } = res.data.data;
        setWeeks(weeks);
        setPagination({ total, pages, currentPage });
      }
    } catch (err) {
      enqueueSnackbar("Failed to fetch weeks", { variant: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeks(pagination.currentPage);
  }, [pagination.currentPage]);

  const handlePageChange = (event, newPage) => {
    setPagination((prev) => ({ ...prev, currentPage: newPage }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleOpen = (week = null) => {
    if (week) {
      setEditMode(true);
      setSelectedId(week.id);
      setForm({
        weekNumber: week.weekNumber,
        title: week.title,
        introText: week.introText || "",
      });
    } else {
      setEditMode(false);
      setForm({
        weekNumber: pagination.total + 1,
        title: "",
        introText: "",
      });
    }
    setSelectedFile(null); // Reset file selection
    setOpen(true);
  };

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);

      const formData = new FormData();
      formData.append("weekNumber", form.weekNumber);
      formData.append("title", form.title);
      formData.append("introText", form.introText);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      if (editMode) {
        await api.put(`/admin/weeks/${selectedId}`, formData, config);
        enqueueSnackbar("Week updated successfully", { variant: "success" });
      } else {
        await api.post("/admin/weeks", formData, config);
        enqueueSnackbar("Week created and PDF generated", {
          variant: "success",
        });
      }

      fetchWeeks(pagination.currentPage);
      setOpen(false);
    } catch (err) {
      const msg = err.response?.data?.message || "Error processing request";
      enqueueSnackbar(msg, { variant: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this week? ")) return;
    try {
      await api.delete(`/admin/weeks/${id}`);
      enqueueSnackbar("Week deleted");
      fetchWeeks(pagination.currentPage);
    } catch (err) {
      enqueueSnackbar("Delete failed", { variant: "error" });
    }
  };
const handleViewPdf = async (pdfPath) => {
  try {
    // 1. Hit your API with the path as a query param
    const response = await api.get(`/user/pdf`, {
      params: { path: pdfPath }
    });

    // 2. Extract the signed URL from the response
    const { url } = response.data;

    // 3. Open the PDF in a new tab
    if (url) {
      window.open(url, '_blank');
    }
  } catch (error) {
    console.error("Error fetching PDF URL:", error);
    // Add a toast or notification here for the user
  }
};
  const columns = [
    { field: "weekNumber", headerName: "No.", width: 70 },
    { field: "title", headerName: "Title", flex: 1 },
    { field: "introText", headerName: "Description", flex: 1.5 },
    {
      field: "pdfKey",
      headerName: "PDF Content",
      width: 130,
      renderCell: (params) =>
        params.value ? (
     <Button
  size="small"
  startIcon={<Description />}
  // Call the function with the path from params
  onClick={() => handleViewPdf(params.row.pdfKey)} 
  sx={{
    color: "#7FB33B",
    textTransform: "none",
    "&:hover": {
      backgroundColor: "#7FB33B20",
    },
  }}
>
  View PDF
</Button>
        ) : (
          <Typography variant="caption" color="text.disabled">
            No File
          </Typography>
        ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <IconButton
            onClick={() => handleOpen(params.row)}
            size="small"
            color="primary"
          >
            <Edit fontSize="small" />
          </IconButton>
          <IconButton
            onClick={() => handleDelete(params.row.id)}
            size="small"
            color="error"
          >
            <Delete fontSize="small" />
          </IconButton>
        </Stack>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 3,
          alignItems: "center",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: 700,
            color: colors.dimBlack,
            fontFamily: '"ArialRounded", Arial, sans-serif',
          }}
        >
          Program Weeks Management
        </Typography>

        <CustomButton
          onClick={() => handleOpen()}
          text={" + Add New Week"}
          fullWidth={false}
        />
      </Box>

      <Box
        sx={{
          bgcolor: "white",
          borderRadius: 2,
          border: `1px solid ${colors.lightGrey}`,
          overflow: "hidden",
        }}
      >
        <DataGrid
          rows={weeks}
          columns={columns}
          loading={loading}
          getRowId={(r) => r.id}
          hideFooterPagination
          autoHeight
          sx={{
            fontFamily: '"Montserrat", sans-serif',
          }}
        />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            p: 2,
            borderTop: `1px solid ${colors.lightGrey}`,
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              fontFamily: '"Montserrat", sans-serif',
            }}
          >
            Total {pagination.total} weeks in program
          </Typography>
          <Pagination
            count={pagination.pages}
            page={pagination.currentPage}
            onChange={handlePageChange}
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

      <Dialog
        open={open}
        onClose={() => !submitLoading && setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editMode ? "Edit Week Template" : "Create New Week"}
        </DialogTitle>
        <DialogContent dividers>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <Input
              label="Week Number"
              type="number"
              fullWidth
              value={form.weekNumber}
              onChange={(e) => setForm({ ...form, weekNumber: e.target.value })}
            />
            <Input
              label="Title"
              fullWidth
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <Input
              label="Intro Text"
              multiline
              rows={4}
              fullWidth
              value={form.introText}
              onChange={(e) => setForm({ ...form, introText: e.target.value })}
            />

            <Box>
              <Typography
                variant="subtitle2"
                sx={{ mb: 1, color: "text.secondary" }}
              >
                Program Presentation (PPT/PPTX)
              </Typography>
              <Button
                variant="outlined"
                component="label"
                startIcon={<CloudUpload />}
                fullWidth
                sx={{
                  py: 2,
                  borderStyle: "dashed",
                  borderColor: "#7FB33B",
                  color: "#7FB33B",
                  "&:hover": {
                    borderColor: "#7FB33B",
                    backgroundColor: "#7FB33B15",
                    color: "#7FB33B",
                  },
                }}
              >
                {selectedFile
                  ? selectedFile.name
                  : "Select PPT to Convert to PDF"}
                <input
                  type="file"
                  hidden
                  accept=".ppt,.pptx"
                  onChange={handleFileChange}
                />
              </Button>
              {editMode && !selectedFile && (
                <Typography
                  variant="caption"
                  sx={{ mt: 1, display: "block", textAlign: "center" }}
                >
                  Leave empty to keep existing PDF
                </Typography>
              )}
            </Box>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={() => setOpen(false)}
            disabled={submitLoading}
            sx={{
              color: "#000",
            }}
          >
            Cancel
          </Button>
          <CustomButton
            onClick={handleSubmit}
            disabled={submitLoading || !form.title || !form.weekNumber}
            text={
              submitLoading ? (
                <CircularProgress size={24} color="inherit" />
              ) : editMode ? (
                "Update Week"
              ) : (
                "Create Week"
              )
            }
            fullWidth={false}
          />
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Weeks;
