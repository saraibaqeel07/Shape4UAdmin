import { DataGrid as MuiDataGrid } from '@mui/x-data-grid';
import { Box, Typography } from '@mui/material';

const DataGrid = ({ 
  rows = [], 
  columns = [], 
  loading = false,
  pageSize = 10,
  page = 1,
  limit = 10,
  pageCount = 1,
  noDataMessage = "No data available",
  ...props 
}) => {
  console.log("DataGrid received rows:", rows);
  console.log("DataGrid received columns:", columns);

  return (
    <Box sx={{ 
      width: '100%', 
      minHeight: 400,
      backgroundColor: 'white',
      borderRadius: 1,
      boxShadow: '0px 2px 4px -1px rgba(0,0,0,0.05), 0px 4px 6px -1px rgba(0,0,0,0.05)',
      overflow: 'hidden',
    }}>
      <MuiDataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: pageSize,
              page: page,
              pageCount: pageCount,
            },
          },
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        page={page}
        limit={limit}
        checkboxSelection={false}
        disableRowSelectionOnClick
        // autoHeight
        sx={{
          border: 'none',
           height: "100%",
          width: '100%',
          '& .MuiDataGrid-root': {
            backgroundColor: 'white',
          },
          // Header styles
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: '#FAFAFA',
            borderBottom: '1px solid #F0F0F0',
            '& .MuiDataGrid-columnHeader': {
              '&:focus': {
                outline: 'none',
              },
              '&:focus-within': {
                outline: 'none',
              },
            },
          },
          // Row styles
          '& .MuiDataGrid-row': {
            '&:hover': {
              backgroundColor: '#F9FAFB',
            },
            '&.Mui-selected': {
              backgroundColor: '#F5F3FF',
              '&:hover': {
                backgroundColor: '#EDE9FE',
              },
            },
          },
          // Cell styles
          '& .MuiDataGrid-cell': {
            borderColor: '#F0F0F0',
            '&:focus': {
              outline: 'none',
            },
            '&:focus-within': {
              outline: 'none',
            },
          },
          // Footer styles
          '& .MuiDataGrid-footerContainer': {
            borderTop: '1px solid #F0F0F0',
            backgroundColor: '#FAFAFA',
          },
          // Pagination styles
          '& .MuiTablePagination-root': {
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              color: '#6B7280',
            },
          },
          // Loading overlay
          '& .MuiDataGrid-loadingOverlay': {
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
          },
          // Column menu
          '& .MuiDataGrid-menuIcon': {
            '& .MuiSvgIcon-root': {
              color: '#6B7280',
            },
          },
          // Sort icon
          '& .MuiDataGrid-sortIcon': {
            color: '#6B7280',
          },
          // Column separator
          '& .MuiDataGrid-columnSeparator': {
            color: '#F0F0F0',
          },
          // Empty overlay
          '& .MuiDataGrid-overlay': {
            backgroundColor: 'transparent',
          },
          // No data overlay - custom styling
          '& .MuiDataGrid-main': {
            // This ensures the grid maintains its structure even without data
            minHeight: '300px',
          },
          '& .MuiDataGrid-virtualScroller': {
            // Ensure the scroller has a minimum height
            minHeight: '300px',
          },
        }}
        components={{
          NoRowsOverlay: () => (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                minHeight: '300px',
                p: 2,
              }}
            >
              <Typography variant="body1" color="text.secondary">
                {noDataMessage}
              </Typography>
            </Box>
          ),
        }}
        {...props}
      />
    </Box>
  );
};

export default DataGrid; 