import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router';

const Category1 = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [descModalOpen, setDescModalOpen] = useState(false); // New state for description modal
  const [currentRow, setCurrentRow] = useState(null);
  const [updatedCategoryName, setUpdatedCategoryName] = useState('');
  const [updatedDescription, setUpdatedDescription] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedDescription, setSelectedDescription] = useState(''); // State for selected description
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  



  const [searchTerm, setSearchTerm] = useState('');
  const filteredRows = rows.filter(row => {
    const searchLower = searchTerm.toLowerCase();
    return row.categoryName.toLowerCase().includes(searchLower) || row.description.toLowerCase().includes(searchLower);
  });

  

  const navigate = useNavigate();

  // Check for the token and redirect to login if not present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const decodeJWT = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  const getEmployeeIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("Token not found in localStorage");
      return null;
    }

    try {
      const decodedToken = decodeJWT(token);
      return decodedToken.employee_id; // Adjust based on your JWT payload
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };

  const employeeId = getEmployeeIdFromToken();
  console.log(employeeId +"sheikh");

  const handleOpen = (row) => {
    setCurrentRow(row);
    setUpdatedCategoryName(row.categoryName);
    setUpdatedDescription(row.description);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setCurrentRow(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleDescModalClose = () => {
    setDescModalOpen(false);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this author?");

    if (!confirmed) {
      return; // If user cancels, do nothing
    }
    try {
      const response = await fetch(`http://localhost:8085/api/v1/category/${id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorData = await response.text(); // Parse text response
  
        setSnackbar({
          open: true,
          message: errorData.includes('foreign key constraint')
            ? 'Category is in use and cannot be deleted.'
            : 'An unexpected error occurred.',
          severity: 'error',
        });
  
        return;
      }
  
      setRows(rows.filter((row) => row.id !== id));
      setSnackbar({
        open: true,
        message: 'Category deleted successfully!',
        severity: 'success',
      });
    } catch (error) {
      console.error('Error deleting category:', error);
      setSnackbar({
        open: true,
        message: 'An unexpected error occurred.',
        severity: 'error',
      });
    }
  };
  

  const handleUpdate = async () => {
    if (!updatedCategoryName.trim()) {
      setSnackbar({ open: true, message: 'Category Name cannot be empty!', severity: 'error' });
      return;
    }

    if (currentRow) {
      try {
        const updatedData = {
          categoryName: updatedCategoryName,
          description: updatedDescription,
          employeeId: employeeId,
        };
        const response = await fetch(`http://localhost:8085/api/v1/category/${currentRow.categoryId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedData),
        });

        if (!response.ok) {
          const errorData = await response.json();
          setSnackbar({
            open: true,
            message: errorData.message.includes('already exists')
              ? 'Category with this name already exists!'
              : 'An error occurred while updating the category.',
            severity: 'error',
          });
          return;
        }

        const updatedCategory = await response.json();
        setRows(rows.map(row => (row.id === currentRow.id ? { ...row, ...updatedCategory } : row)));
        handleClose();
        setSnackbar({ open: true, message: 'Category updated successfully!', severity: 'success' });
      } catch (error) {
        console.error('Error updating category:', error);
        setSnackbar({ open: true, message: 'Category with this name already exists!', severity: 'error' });
      }
    }
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      setSnackbar({ open: true, message: 'Category Name cannot be empty!', severity: 'error' });
      return;
    }

    try {
      const newCategory = {
        categoryName: newCategoryName,
        description: newDescription,
        employeeId: employeeId,
      };
      const response = await fetch('http://localhost:8085/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCategory),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbar({
          open: true,
          message: errorData.message.includes('already exists')
            ? 'Category with this name already exists!'
            : 'An error occurred while adding the category.',
          severity: 'error',
        });
        return;
      }

      const createdCategory = await response.json();
      setRows([...rows, { id: createdCategory.categoryId, ...createdCategory }]);
      handleModalClose();
      setSnackbar({ open: true, message: 'Category added successfully!', severity: 'success' });
    } catch (error) {
      console.error('Error adding category:', error);
      setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
    }
  };

  // Function to open the description modal
  const handleOpenDescModal = (description) => {
    setSelectedDescription(description);
    setDescModalOpen(true);
  };

  // Define columns for the DataGrid
  const columns = [
    { field: 'categoryName', headerName: 'Category Name', flex: 1 },
    {
      field: 'description',
      headerName: 'Description',
      flex: 2,
      renderCell: (params) => {
        const desc = params.row.description || ''; // Default to an empty string if null
        return (
          <Button
            variant="text"
            onClick={() => handleOpenDescModal(desc)}
            sx={{
              textTransform: 'none',
              textAlign: 'left',
              color: 'black',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {desc.length > 20 ? `${desc.substring(0, 20)}...` : desc}
          </Button>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/category/employee/${employeeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const apiData = data.map(item => ({
          id: item.categoryId,
          categoryId: item.categoryId,
          categoryName: item.categoryName,
          description: item.description,
          employeeId: item.employeeId,
        }));
        setRows(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="div" gutterBottom>
          Category Records
        </Typography>
        <Box flex={1} display="flex" justifyContent="flex-start">
              <TextField
                variant="outlined"
                label="Search Author"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{
                  width: {
                    xs: '100%',
                    sm: 300,
                  },
                  paddingX: 1,
                }}
              />
            </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setModalOpen(true)}
          sx={{ mb: 2 }}
        >
          Add Category
        </Button>
        </Box>
        <Box sx={{ height: 400, mt: 2, overflowX: 'auto' }}>
      <div style={{ minWidth: '1000px' }}> 
          {/* <DataGrid
            rows={rows}
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
          /> */}

          <DataGrid
            rows={filteredRows}  // Use filtered rows here
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
          />
          </div>
        </Box>
      </CardContent>

      {/* Update Modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, }}>
          <Typography id="modal-title" variant="h6" component="h2">
            Update Category
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            value={updatedCategoryName}
            onChange={(e) => setUpdatedCategoryName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={updatedDescription}
            onChange={(e) => setUpdatedDescription(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleUpdate} variant="contained" color="primary" sx={{ mr: 1 }}>
              Save
            </Button>
            <Button onClick={handleClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Add Modal */}
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="add-modal-title"
        aria-describedby="add-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2, }}>
          <Typography id="add-modal-title" variant="h6" component="h2">
            Add New Category
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Category Name"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleAddCategory} variant="contained" color="primary" sx={{ mr: 1 }}>
              Add
            </Button>
            <Button onClick={handleModalClose} variant="outlined" color="secondary">
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Description Modal */}
      <Modal
        open={descModalOpen}
        onClose={handleDescModalClose}
        // aria-labelledby="description-modal-title"
        // aria-describedby="description-modal-description"
      >
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4 , borderRadius: 2}}>
          <Typography id="description-modal-title" variant="h6" component="h2">
            Full Description
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedDescription}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleDescModalClose} variant="outlined" color="secondary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
     

      {/* Snackbar for Notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Card>
  );
};

Category1.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
};

export default Category1;
