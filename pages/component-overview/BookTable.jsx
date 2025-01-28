import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { DataGrid } from '@mui/x-data-grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import { useNavigate } from 'react-router';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Add this import for the icon
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';


const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  backgroundColor: 'white',
  padding: 4,
  borderRadius: 2,
  boxShadow: 24,
};

const Book = () => {
  const navigate = useNavigate();

  const verifyToken = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return false;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp > currentTime; // Check if the token is still valid
    } catch (error) {
      console.error("Error verifying token:", error);
      return false;
    }
  };

  // Check for the token and redirect to login if not present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!verifyToken()) {
      setSnackbar({ open: true, message: 'Session Expire!', severity: 'error' });
      setTimeout(() => {
        navigate("/login");
      }, 2000); 
    }
  }, [navigate]);

  const [bookRows, setBookRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDescModal, setOpenDescModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const [openAddCategoryModal, setOpenAddCategoryModal] = useState(false); // New state for category modal
  const [openAddAuthorModal, setOpenAddAuthorModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState({});
  const [selectedDescription, setSelectedDescription] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });


  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);

  const filteredBooks = bookRows.filter((book) => {
    const lowercasedSearchTerm = searchTerm.toLowerCase();
    return (
      book.title.toLowerCase().includes(lowercasedSearchTerm) ||
      book.desc.toLowerCase().includes(lowercasedSearchTerm) ||
      book.author.toLowerCase().includes(lowercasedSearchTerm) ||
      book.genre.toLowerCase().includes(lowercasedSearchTerm) ||
      book.isbn.toLowerCase().includes(lowercasedSearchTerm) ||
      book.price.toString().includes(lowercasedSearchTerm) ||
      book.quantity.toString().includes(lowercasedSearchTerm)
    );
  });

  const decodeJWT = (token) => {
    try {
      const payload = token.split(".")[1];
      return JSON.parse(atob(payload));
    } catch (error) {
      console.error("Failed to decode JWT:", error);
      return null;
    }
  };

  const token = localStorage.getItem("token");
  const getEmployeeIdFromToken = () => {
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
  const [newBook, setNewBook] = useState({
    bookName: '',
    description: '',
    employeeId: employeeId,
    authorName: '',
    categoryName: '',
    isbnNo: '',
    price: '',
    quantity: '',
    rating: '',
  });

  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    description: '',
    employeeId: employeeId,
  });
  const [newAuthor, setNewAuthor] = useState({
    authorName: '',
    description: '',
    employeeId: employeeId,
  });

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/v1/category/employee/${employeeId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      // setCategories(data);
      setCategories(data.sort((a, b) => a.categoryName.localeCompare(b.categoryName))); // Sort categories alphabetically

    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/v1/author/employee/${employeeId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      // setAuthors(data);
      setAuthors(data.sort((a, b) => a.authorName.localeCompare(b.authorName))); // Sort authors alphabetically

    } catch (error) {
      console.error('Error fetching authors:', error);
    }
  };

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/v1/book/employee/${employeeId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const newToken = response.headers.get('Authorization');
      if (newToken) {

        // Store the new token in localStorage (or sessionStorage, if preferred)
        localStorage.setItem('token', newToken.replace('Bearer ', ''));
      }
      console.log(localStorage.getItem('token'))

      const data = await response.json();
      const books = data.map((book) => ({
        id: book.bookId,
        title: book.bookName,
        desc: book.description,
        author: book.authorName,
        genre: book.categoryName,
        isbn: book.isbnNo,
        price: book.price,
        quantity: book.quantity,
        rating: book.rating,
      }));
      setBookRows(books);
    } catch (error) {
      console.error('Error fetching book data:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBook = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this author?");
    if (!confirmed) return;

    try {
      const response = await fetch(`http://localhost:8085/api/v1/book/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setBookRows((prevRows) => prevRows.filter((book) => book.id !== id));
      // alert('Book deleted successfully.');
      setSnackbar({ open: true, message: 'Book deleted successfully.', severity: 'success' });
    } catch (error) {
      console.error('Error deleting book:', error);
      setSnackbar({ open: true, message: 'failed to delete book', severity: 'error' });

    }
  };

  const updateBook = async (id, updatedBook) => {
    // API call logic for updating book
    // Validations and payload formation
    console.log('Updated Book before API call:', updatedBook);

    // Check for validation
    if (!updatedBook.title || !updatedBook.isbn) {
      alert("Please fill in all required fields and ensure title and isbn no.");
      return;
    }

    // Create the payload to match the API requirements
    const payload = {
      bookName: updatedBook.title,
      description: updatedBook.desc,
      employeeId: employeeId,
      authorName: updatedBook.author,
      categoryName: updatedBook.genre,
      isbnNo: updatedBook.isbn,
      price: updatedBook.price,
      quantity: updatedBook.quantity,
      rating: updatedBook.rating,
    };

    try {
      const response = await fetch(`http://localhost:8085/api/v1/book/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload), // Send the transformed payload
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      await fetchBooks();
      // alert('Book updated successfully.');
      setSnackbar({ open: true, message: 'Book updated successfully.', severity: 'success' });

    } catch (error) {
      console.error('Error updating book:', error);
      const errorResponse = await response.text(); // Log the error response for debugging
      console.error('Error Response:', errorResponse);
      setSnackbar({ open: true, message: 'failed to update book', severity: 'error' });

    } finally {
      setOpenUpdateModal(false);

    }
  };




  const addBook = async () => {

    try {
      const response = await fetch('http://localhost:8085/api/v1/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchBooks();
      // alert('Book added successfully.');
      setSnackbar({ open: true, message: 'Book added successfully.', severity: 'success' });

    } catch (error) {
      console.error('Error adding book:', error);
      setSnackbar({ open: true, message: 'failed to add book', severity: 'error' });

    } finally {
      setOpenAddModal(false);
      setNewBook({
        bookName: '',
        description: '',
        employeeId: employeeId,
        authorName: '',
        categoryName: '',
        isbnNo: '',
        price: '',
        quantity: '',
        rating: '',
      });
    }
  };

  const addCategory = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newCategory),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // alert('Category added successfully.');
      setSnackbar({ open: true, message: 'category added successfully.', severity: 'success' });

      fetchCategories(); // Refresh the category list
    } catch (error) {
      console.error('Error adding category:', error);
      setSnackbar({ open: true, message: 'failed to add category', severity: 'error' });

    } finally {
      setOpenAddCategoryModal(false);
      setNewCategory({
        categoryName: '',
        description: '',
        employeeId: employeeId,
      });
    }
  };
  const addAuthor = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/v1/author', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newAuthor),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      // alert('Author added successfully.');
      setSnackbar({ open: true, message: 'author added successfully.', severity: 'success' });

      fetchAuthors(); // Refresh the category list
    } catch (error) {
      console.error('Error adding Author:', error);
      setSnackbar({ open: true, message: 'failed to add author', severity: 'error' });

    } finally {
      setOpenAddAuthorModal(false);
      setNewAuthor({
        authorName: '',
        description: '',
        employeeId: employeeId,
      });
    }
  };

  useEffect(() => {
    fetchBooks();
    fetchCategories();
    fetchAuthors();
  }, []);

  const handleOpenDescModal = (desc) => {
    setSelectedDescription(desc);
    setOpenDescModal(true);
  };

  const handleCloseDescModal = () => setOpenDescModal(false);

  const handleOpenUpdateModal = (book) => {
    setSelectedBook(book);
    setOpenUpdateModal(true);
  };

  const handleCloseUpdateModal = () => setOpenUpdateModal(false);

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => setOpenAddModal(false);

  const handleOpenAddCategoryModal = () => setOpenAddCategoryModal(true);
  const handleCloseAddCategoryModal = () => setOpenAddCategoryModal(false);
  const handleOpenAddAuthorModal = () => setOpenAddAuthorModal(true);
  const handleCloseAddAuthorModal = () => setOpenAddAuthorModal(false);
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };
  const bookColumns = [
    { field: 'title', headerName: 'Title', flex: 1 , headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ), },
    { field: 'author', headerName: 'Author', flex: 1, headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ), },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        const description = params.row.desc || '';
        return (
          <Button
            variant="text"
            onClick={() => handleOpenDescModal(description)}
            sx={{
              textTransform: 'none',
              textAlign: 'left',
              color: 'black',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            {description.length > 20
              ? `${description.substring(0, 20)}...`
              : description}
          </Button>
        );
      },
    },
    { field: 'genre', headerName: 'Genre', flex: 1, headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ), },
    { field: 'isbn', headerName: 'ISBN', flex: 1 , headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ),},
    { field: 'price', headerName: 'Price', flex: 1 , headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ),},
    { field: 'quantity', headerName: 'Quantity', flex: 1, headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ), },
    { field: 'rating', headerName: 'Rating', flex: 1 , headerClassName: 'custom-header', 
      renderCell: (params) => (
        <div style={{ fontSize: '16px', fontFamily: 'Arial, sans-serif', color: 'black' }}>
          {params.value}
        </div>
      ),},
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpenUpdateModal(params.row)}
          >
            Update
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => deleteBook(params.row.id)}
          >
            Delete
          </Button>
        </Stack>
      ),
    },
  ];

  return (
    <Card sx={{ borderRadius: 2, boxShadow: 3 }}>
      <CardContent sx={{ height: 830, mt: 2, overflowX: 'auto' }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" component="div" gutterBottom>
            Book Records
          </Typography>

          <Box flex={1} display="flex" justifyContent="flex-start">
            <TextField
              variant="outlined"
              label="Search"
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
            onClick={handleOpenAddModal}
            sx={{ mb: 2 }}
          >
            Add Book
          </Button>
        </Box>

        <Box sx={{ height: 750, mt: 2, overflowX: 'auto' }}>
          <div style={{ minWidth: '1400px', }}>
            <DataGrid
              rows={filteredBooks}
              columns={bookColumns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              loading={loading}
              checkboxSelection
              disableSelectionOnClick
              sx={{
                // Optionally, you can also style the DataGrid itself here
                '& .MuiDataGrid-columnHeaders': {
                  fontSize: '18px', // Font size for column headers
                  fontFamily: 'Arial, sans-serif', // Font family for column headers
                  color: 'black', // Color for column headers
                },
              }}
            />
          </div>
        </Box>
      </CardContent>

 {/* Description Modal */}
      <Modal
        open={openDescModal}
        // onClose={handleCloseDescModal}
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
            <Button onClick={handleCloseDescModal} variant="outlined" color="secondary">
              Close
            </Button>
          </Box>
        </Box>
      </Modal>


      {/* Modal for updating */}
      <Modal open={openUpdateModal} onClose={handleCloseUpdateModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Update Book
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={selectedBook.title || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, title: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={selectedBook.desc || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, desc: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedBook.genre || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, genre: e.target.value })
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Adjust the height as needed
                    overflowY: 'auto', // Enable vertical scrolling
                  },
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryName} value={category.categoryName}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Add new category">
              {/* <IconButton onClick={handleOpenAddCategoryModal} sx={{ ml: 2 }}> */}
              {/* <AddCircleIcon color="primary" /> */}
              <div onClick={handleOpenAddCategoryModal} style={{ cursor: 'pointer' }}>
                <a style={{ fontSize: '15px', textDecoration: 'none' }}>add new category</a>
              </div>
              {/* </IconButton> */}
            </Tooltip>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Author</InputLabel>
            <Select
              value={selectedBook.author || ''}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, author: e.target.value })
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Adjust the height as needed
                    overflowY: 'auto', // Enable vertical scrolling
                  },
                },
              }}
            >
              {authors.map((author) => (
                <MenuItem key={author.authorName} value={author.authorName}>
                  {author.authorName}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Add new category">
              <div onClick={handleOpenAddAuthorModal} style={{ cursor: 'pointer' }}>
                <a style={{ fontSize: '15px', textDecoration: 'none' }}>add new Author</a>
              </div>
            </Tooltip>
          </FormControl>

          <TextField
            label="ISBN No."
            fullWidth
            value={selectedBook.isbn || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, isbn: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={selectedBook.rating || 1}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, rating: e.target.value })
              }
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Price"
            type="number"
            fullWidth
            value={selectedBook.price || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, price: parseFloat(e.target.value) })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={selectedBook.quantity || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, quantity: parseInt(e.target.value, 10) })
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              onClick={() => updateBook(selectedBook.id, selectedBook)}
              sx={{ mt: 2 }}
              variant="contained"
              color="primary"
            >
              Save
            </Button>
            <Button
              onClick={handleCloseUpdateModal}
              sx={{ mt: 2, ml: 1 }}
              variant="outlined"
              color="secondary"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for Adding Book */}
      <Modal open={openAddModal} onClose={handleCloseAddModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Add Book
          </Typography>
          <TextField
            label="Title"
            fullWidth
            value={newBook.bookName}
            onChange={(e) =>
              setNewBook({ ...newBook, bookName: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newBook.description}
            onChange={(e) =>
              setNewBook({ ...newBook, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={newBook.categoryName || ''}
              onChange={(e) =>
                setNewBook({ ...newBook, categoryName: e.target.value })
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Adjust the height as needed
                    overflowY: 'auto', // Enable vertical scrolling
                  },
                },
              }}
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryName} value={category.categoryName}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Add new category">
              <div onClick={handleOpenAddCategoryModal} style={{ cursor: 'pointer' }}>
                <a style={{ fontSize: '15px', textDecoration: 'none' }}>add new category</a>
              </div>
            </Tooltip>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Author</InputLabel>
            <Select
              value={newBook.authorName || ''}
              onChange={(e) =>
                setNewBook({ ...newBook, authorName: e.target.value })
              }
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 200, // Adjust the height as needed
                    overflowY: 'auto', // Enable vertical scrolling
                  },
                },
              }}
            >
              {authors.map((author) => (
                <MenuItem key={author.authorName} value={author.authorName}>
                  {author.authorName}
                </MenuItem>
              ))}
            </Select>
            <Tooltip title="Add new category">
              <div onClick={handleOpenAddAuthorModal} style={{ cursor: 'pointer' }}>
                <a style={{ fontSize: '15px', textDecoration: 'none' }}>add new Author</a>
              </div>
            </Tooltip>
          </FormControl>

          <TextField
            label="ISBN No."
            fullWidth
            value={newBook.isbnNo}
            onChange={(e) =>
              setNewBook({ ...newBook, isbnNo: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={newBook.rating || ''}
              onChange={(e) =>
                setNewBook({ ...newBook, rating: e.target.value })
              }
            >
              {['', 1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Rating</InputLabel>
            <Select
              value={selectedBook.rating || 1}
              onChange={(e) =>
                setSelectedBook({ ...selectedBook, rating: e.target.value })
              }
            >
              {[1, 2, 3, 4, 5].map((rating) => (
                <MenuItem key={rating} value={rating}>
                  {rating}
                </MenuItem>
              ))}
            </Select>
          </FormControl> */}

          <TextField
            label="Price"
            type="number"
            fullWidth
            value={newBook.price}
            onChange={(e) =>
              setNewBook({ ...newBook, price: parseFloat(e.target.value) })
            }
            sx={{ mt: 2 }}
          />

          <TextField
            label="Quantity"
            type="number"
            fullWidth
            value={newBook.quantity}
            onChange={(e) =>
              setNewBook({ ...newBook, quantity: parseInt(e.target.value, 10) })
            }
            sx={{ mt: 2 }}
          />

          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={addBook} sx={{ mt: 2 }} variant="contained">
              Add Book
            </Button>
            <Button
              onClick={handleCloseAddModal}
              sx={{ mt: 2, ml: 1 }}
              variant="outlined"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Modal for Adding Category */}
      <Modal open={openAddCategoryModal} onClose={handleCloseAddCategoryModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Add Category
          </Typography>
          <TextField
            label="Category Name"
            fullWidth
            value={newCategory.categoryName}
            onChange={(e) =>
              setNewCategory({ ...newCategory, categoryName: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newCategory.description}
            onChange={(e) =>
              setNewCategory({ ...newCategory, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={addCategory} sx={{ mt: 2 }} variant="contained">
              Add Category
            </Button>
            <Button
              onClick={handleCloseAddCategoryModal}
              sx={{ mt: 2, ml: 1 }}
              variant="outlined"
            >
              Close
            </Button>
          </Box>
        </Box>
      </Modal>
      <Modal open={openAddAuthorModal} onClose={handleCloseAddAuthorModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Add Author
          </Typography>
          <TextField
            label="Author Name"
            fullWidth
            value={newAuthor.authorName}
            onChange={(e) =>
              setNewAuthor({ ...newAuthor, authorName: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <TextField
            label="Description"
            fullWidth
            value={newAuthor.description}
            onChange={(e) =>
              setNewAuthor({ ...newAuthor, description: e.target.value })
            }
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={addAuthor} sx={{ mt: 2 }} variant="contained">
              Add Author
            </Button>
            <Button
              onClick={handleCloseAddAuthorModal}
              sx={{ mt: 2, ml: 1 }}
              variant="outlined"
            >
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

export default Book;
