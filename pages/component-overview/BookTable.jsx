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




const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};

const Book = () => {




  const navigate = useNavigate();

  useEffect(() => {
     const token = localStorage.getItem("token");
     if (!token) {
       navigate("/login");
     }
   }, [navigate]);
 



  const [bookRows, setBookRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDescModal, setOpenDescModal] = useState(false);
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false); // New state for Add Book modal
  const [selectedBook, setSelectedBook] = useState({});
  const [selectedDescription, setSelectedDescription] = useState('');

const [searchTerm, setSearchTerm] = useState('');
const [categories, setCategories] = useState([]);
const [newCategory, setNewCategory] = useState('')


// Filter the books based on the search term
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
  
  // State for new book details

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
  const [newBook, setNewBook] = useState({
    bookName: '',
    description: '',
    employeeId: employeeId, // Assuming a static employeeId for now
    authorName: '',
    categoryName: '',
    isbnNo: '',
    price: '',
    quantity: '',
    rating: '',
  });



  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`http://localhost:8085/api/v1/category/employee/${employeeId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCategories(data);  // Store the fetched categories in state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
  
    fetchCategories();
  }, [employeeId]); // Add employeeId as a dependency if it changes


  const handleSaveCategory = async () => {
  if (newCategory.trim()) {
    try {
      const response = await fetch('http://localhost:8085/api/v1/category', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName: newCategory, employeeId: employeeId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Category added successfully');
      fetchCategories(); // Re-fetch categories to include the new one
      setNewCategory(''); // Clear the new category input
    } catch (error) {
      console.error('Error adding category:', error);
    }
  }
};

  

  const fetchBooks = async () => {
    try {
      const response = await fetch(`http://localhost:8085/api/v1/book/employee/${employeeId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
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

    if (!confirmed) {
      return; // If user cancels, do nothing
    }
    try {
      const response = await fetch(`http://localhost:8085/api/v1/book/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      setBookRows((prevRows) => prevRows.filter((book) => book.id !== id));
      alert('Book deleted successfully.');
    } catch (error) {
      console.error('Error deleting book:', error);
    }
  };

  const updateBook = async (id, updatedBook) => {
    console.log('Updated Book before API call:', updatedBook);
    
    // Check for validation
    if (!updatedBook.title ||  !updatedBook.isbn || updatedBook.price <= 0 || updatedBook.quantity <= 0) {
      alert("Please fill in all required fields and ensure price and quantity are valid.");
      return;
    }
  
    // Create the payload to match the API requirements
    const payload = {
      bookName: updatedBook.title,
      description: updatedBook.desc,
      employeeId: 2, // or any appropriate employeeId
      authorName: updatedBook.author ,
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
        },
        body: JSON.stringify(payload), // Send the transformed payload
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      await fetchBooks();
      alert('Book updated successfully.');
    } catch (error) {
      console.error('Error updating book:', error);
      const errorResponse = await response.text(); // Log the error response for debugging
      console.error('Error Response:', errorResponse);
    } finally {
      setOpenUpdateModal(false);
      
    }
  };
  

  // New function to add a book
  const addBook = async () => {
    try {
      const response = await fetch('http://localhost:8085/api/v1/book', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBook),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      await fetchBooks();
      alert('Book added successfully.');
    } catch (error) {
      console.error('Error adding book:', error);
    } finally {
      setOpenAddModal(false);
      setNewBook({
        bookName: '',
        description: '',
        employeeId: 2,
        authorName: '',
        categoryName: '',
        isbnNo: '',
        price: '',
        quantity: '',
        rating: '',
      }); // Reset new book state
    }
  };

  useEffect(() => {
    fetchBooks();
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

  const handleOpenAddModal = () => setOpenAddModal(true); // Open add book modal
  const handleCloseAddModal = () => setOpenAddModal(false); // Close add book modal

  const bookColumns = [
    { field: 'title', headerName: 'Title', flex: 1 },
    { field: 'author', headerName: 'Author', flex: 1 },
    {
      field: 'desc',
      headerName: 'Description',
      flex: 1,
      renderCell: (params) => {
        const description = params.row.desc || ''; // Default to an empty string if null
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
    { field: 'genre', headerName: 'Genre', flex: 1 },
    { field: 'isbn', headerName: 'ISBN', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1, },
    { field: 'quantity', headerName: 'Quantity', flex: 1,  },
    { field: 'rating', headerName: 'Rating', flex: 1,},
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
      <CardContent>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h5" component="div" gutterBottom>
          Book Records
        </Typography>
        {/* <Box flex={1} display="flex" justifyContent="flex-start">
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
            </Box> */}
            <Box flex={1} display="flex" justifyContent="flex-start">
  <TextField
    variant="outlined"
    label="Search"
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}  // Update searchTerm state
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
          onClick={handleOpenAddModal} // Open add book modal
          sx={{ mb: 2 }}
        >
          Add Book
        </Button>
        </Box>
        <Box sx={{ height: 400, mt: 2, overflowX: 'auto' }}>
        <div style={{ minWidth: '1400px' }}> 
          {/* <DataGrid
            rows={bookRows}
            columns={bookColumns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            loading={loading}
            checkboxSelection
            disableSelectionOnClick
          /> */}

<DataGrid
  rows={filteredBooks}  // Use filtered rows
  columns={bookColumns}
  pageSize={5}
  rowsPerPageOptions={[5]}
  loading={loading}
  checkboxSelection
  disableSelectionOnClick
/>
            </div>
        </Box>
      </CardContent>
      <Modal open={openDescModal} onClose={handleCloseDescModal}>
        <Box sx={modalStyle}>
          <Typography variant="h6" component="h2">
            Full Description
          </Typography>
          <Typography sx={{ mt: 2 }}>{selectedDescription}</Typography>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
            <Button onClick={handleCloseDescModal} color="secondary" variant="outlined">
            Close
            </Button>
          </Box>
        </Box>
      </Modal>
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
              // setSelectedBook({ ...selectedBook, title: e.target.value.trim() })
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
    label="Category"
    value={selectedBook.genre || ''}
    onChange={(e) => setSelectedBook({ ...selectedBook, genre: e.target.value })}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    {categories.map((category) => (
      <MenuItem key={category.categoryId} value={category.categoryName}>
        {category.categoryName}
      </MenuItem>
    ))}
    <MenuItem value="new-category">
      Add New Category
    </MenuItem>
  </Select>
</FormControl>

{/* Show an input field to add a new category if 'Add New Category' is selected */}
{selectedBook.genre === 'new-category' && (
  <TextField
    label="New Category"
    fullWidth
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    sx={{ mt: 2 }}
  />
)}


          <TextField
            label="Author"
            fullWidth
            value={selectedBook.author || ''}
            onChange={(e) =>
              setSelectedBook({ ...selectedBook, author: e.target.value })
            }
            sx={{ mt: 2 }}
          />
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
              label="Rating"
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
              setSelectedBook({
                ...selectedBook,
                quantity: parseInt(e.target.value, 10),
              })
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

      {/* Add Book Modal */}
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
    label="Category"
    value={selectedBook.genre || ''}
    onChange={(e) => setSelectedBook({ ...selectedBook, genre: e.target.value })}
  >
    <MenuItem value="">
      <em>None</em>
    </MenuItem>
    {categories.map((category) => (
      <MenuItem key={category.categoryId} value={category.categoryName}>
        {category.categoryName}
      </MenuItem>
    ))}
    <MenuItem value="new-category">
      Add New Category
    </MenuItem>
  </Select>
</FormControl>

{/* Show an input field to add a new category if 'Add New Category' is selected */}
{selectedBook.genre === 'new-category' && (
  <TextField
    label="New Category"
    fullWidth
    value={newCategory}
    onChange={(e) => setNewCategory(e.target.value)}
    sx={{ mt: 2 }}
  />
)}


          <TextField
            label="Author"
            fullWidth
            value={newBook.authorName}
            onChange={(e) =>
              setNewBook({ ...newBook, authorName: e.target.value })
            }
            sx={{ mt: 2 }}
          />
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
              label="Rating"
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
          <Button
            onClick={addBook}
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
          >
            Add Book
          </Button>
          <Button
             onClick={handleCloseAddModal}
              sx={{ mt: 2, ml: 1 }}
            variant="outlined"
              color="secondary"
            >
          Close
            </Button>
            </Box>
        </Box>
      </Modal>
    </Card>
  );
};

Book.propTypes = {
  rows: PropTypes.array,
  columns: PropTypes.array,
};

export default Book;
