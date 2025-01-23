import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useNavigate } from 'react-router';

// Styling for the modal
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

// Author columns definition
const authorColumns = (handleDelete, openModal, handleOpenDescModal) => [
  { field: 'authorName', headerName: 'Author Name', flex: 1 },
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
  { field: 'createdAt', headerName: 'Created At', flex: 1 },
  { field: 'updatedAt', headerName: 'Updated At', flex: 1 },
  {
    field: 'actions',
    headerName: 'Actions',
    flex: 1,
    sortable: false,
    renderCell: (params) => (
      <Stack direction="row" spacing={1}>
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => openModal(params.row)}
        >
          Update
        </Button>
        <Button
          variant="contained"
          color="secondary"
          size="small"
          onClick={() => handleDelete(params.row.authorId)}
          
        >
          Delete
        </Button>
      </Stack>
    ),
  },
];

const Author = () => {
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);

  const [open, setOpen] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const [authorName, setAuthorName] = useState('');
  const [description, setDescription] = useState('');

  const [createOpen, setCreateOpen] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);

  // New state for the description modal
  const [descModalOpen, setDescModalOpen] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState('');

  const navigate = useNavigate();

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
      return decodedToken.employee_id;
    } catch (error) {
      console.error("Error decoding token:", error);
      return null;
    }
  };
  const employeeId = getEmployeeIdFromToken();

  // Fetch authors from the API
  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/author/employee/${employeeId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setAuthors(data);
      } catch (error) {
        console.error('Error fetching authors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  // Filter authors based on search term
  useEffect(() => {
    if (searchTerm) {
      setFilteredAuthors(
        authors.filter((author) => {
          const name = author.authorName?.toLowerCase() || '';
          const desc = author.description?.toLowerCase() || '';
          return name.includes(searchTerm.toLowerCase()) || desc.includes(searchTerm.toLowerCase());
        })
      );
    } else {
      setFilteredAuthors(authors);
    }
  }, [searchTerm, authors]);

  const handleDelete = async (authorId) => {
    const confirmed = window.confirm("Are you sure you want to delete this author?");

    if (!confirmed) {
      return; // If user cancels, do nothing
    }
    try {
      const response = await fetch(`http://localhost:8085/api/v1/author/${authorId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to delete author';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
  
        // Check for foreign key constraint error in the message
        if (errorMessage.includes('foreign key constraint fails')) {
          errorMessage = 'Author is in use and cannot be deleted.';
        }
  
        throw new Error(errorMessage);
      }
  
      // Update the authors list to remove the deleted author
      setAuthors((prevAuthors) =>
        prevAuthors.filter((author) => author.authorId !== authorId)
      );
    } catch (error) {
      // Show the error message in the Snackbar
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  const openModal = (author) => {
    setSelectedAuthor(author);
    setAuthorName(author.authorName);
    setDescription(author.description);
    setOpen(true);
  };

  const closeModal = () => {
    setOpen(false);
    setSelectedAuthor(null);
    setAuthorName('');
    setDescription('');
  };

  const handleUpdate = async () => {
    if (!selectedAuthor) return;

    const updatedAuthor = {
      authorName,
      description,
      employeeId: employeeId,
    };

    try {
      const response = await fetch(`http://localhost:8085/api/v1/author/${selectedAuthor.authorId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedAuthor),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to update author';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const updatedData = await response.json();

      setAuthors((prevAuthors) =>
        prevAuthors.map((author) =>
          author.authorId === updatedData.authorId ? updatedData : author
        )
      );

      closeModal();
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  const handleCreate = async () => {
    const newAuthor = {
      authorName: newAuthorName,
      description: newDescription,
      employeeId: employeeId,
    };

    try {
      const response = await fetch('http://localhost:8085/api/v1/author', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newAuthor),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to create author';
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = await response.text();
        }
        throw new Error(errorMessage);
      }

      const createdAuthor = await response.json();

      setAuthors((prevAuthors) => [...prevAuthors, createdAuthor]);
      setCreateOpen(false);
      setNewAuthorName('');
      setNewDescription('');
    } catch (error) {
      setErrorMessage(error.message);
      setShowError(true);
    }
  };

  // Function to open the description modal
  const handleOpenDescModal = (description) => {
    setSelectedDescription(description);
    setDescModalOpen(true);
  };

  // Close the description modal
  const handleDescModalClose = () => {
    setDescModalOpen(false);
  };

  return (
    <>
      <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" component="div" gutterBottom>
              Author Records
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
            <Button variant="contained" color="primary" onClick={() => setCreateOpen(true)}>
              Add Author
            </Button>
          </Box>
          <Box sx={{ height: 400, mt: 2, overflowX: 'auto' }}>
      <div style={{ minWidth: '1000px' }}> 
            {loading ? (
              <Typography variant="h6" color="textSecondary">
                Loading authors...
              </Typography>
            ) : (
              <DataGrid
                rows={filteredAuthors}
                columns={authorColumns(handleDelete, openModal, handleOpenDescModal)}
                pageSize={5}
                rowsPerPageOptions={[5]}
                checkboxSelection
                disableSelectionOnClick
                getRowId={(row) => row.authorId}
              />
            )}
            </div>
          </Box>
        </CardContent>
      </Card>

      <Modal open={open} onClose={closeModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="div" gutterBottom>
            Update Author
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Author Name"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
          <Button variant="contained" color="primary" onClick={handleUpdate}>
              Update
            </Button>
            <Button variant="outlined" color="secondary" onClick={closeModal}>
              Cancel
            </Button>
           
          </Stack>
        </Box>
      </Modal>

      <Modal open={createOpen} onClose={() => setCreateOpen(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="div" gutterBottom>
            Add Author
          </Typography>
          <TextField
            fullWidth
            margin="normal"
            label="Author Name"
            value={newAuthorName}
            onChange={(e) => setNewAuthorName(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
          />
          <Stack direction="row" spacing={2} justifyContent="flex-end" mt={2}>
            <Button variant="contained" color="secondary" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button variant="contained" color="primary" onClick={handleCreate}>
              Create
            </Button>
          </Stack>
        </Box>
      </Modal>

      <Modal open={descModalOpen} onClose={handleDescModalClose}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="div" gutterBottom>
          Full Description
          </Typography>
          <Typography variant="body1" sx={{ mt: 2 }}>
            {selectedDescription}
          </Typography>

         <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outlined" color="secondary" onClick={handleDescModalClose}>
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      <Snackbar
        open={showError}
        autoHideDuration={6000}
        onClose={() => setShowError(false)}
      >
        <Alert severity="error" onClose={() => setShowError(false)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

Author.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
};

export default Author;
