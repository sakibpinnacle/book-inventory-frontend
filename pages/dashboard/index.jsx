import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useState, useEffect } from 'react';

// project import
import MainCard from 'components/MainCard';
import AnalyticEcommerce from 'components/cards/statistics/AnalyticEcommerce';
import { useNavigate } from 'react-router';

// assets
// ... (your existing imports)

// ==============================|| DASHBOARD - DEFAULT ||============================== //

export default function DashboardDefault() {

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
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token || !verifyToken) {
//       navigate("/login");
//     }
//   }, [navigate]);
   useEffect(() => {
      if (!verifyToken()) {
        setSnackbar({ open: true, message: 'Session Expire!', severity: 'error' });
        setTimeout(() => {
            navigate("/login");
          }, 2000); 
      }
    }, [navigate]);



    const [totalPageViews, setTotalPageViews] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [totalSales, setTotalSales] = useState(0);
    const [bookData, setBookData] = useState([]);
 const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
 const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };


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
      const getEmployeeNameFromToken = () => {
        if (!token) {
          console.error("Token not found in localStorage");
          return null;
        }
    
        try {
          const decodedToken = decodeJWT(token);
          
          return decodedToken.employee_name;
        } catch (error) {
          console.error("Error decoding token:", error);
          return null;
        }
      };

      const employee_name = getEmployeeNameFromToken();
    
      const employeeId = getEmployeeIdFromToken();



    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch book data
                const bookDataResponse = await fetch(`http://localhost:8085/api/v1/book/employee/${employeeId}`,{
                    method: 'GET',
                    headers:{
                      Authorization: `Bearer ${token}`
                    },
                  });


                  const newToken = bookDataResponse.headers.get('Authorization');
          console.log(newToken+"hiii")
          if (newToken) {
            
            // Store the new token in localStorage (or sessionStorage, if preferred)
            localStorage.setItem('token', newToken.replace('Bearer ', ''));
          }
          console.log(localStorage.getItem('token'))
                const bookData = await bookDataResponse.json();
                setBookData(bookData);
                setTotalPageViews(bookData.length); // Assuming this is how you get total page views

                // Fetch author data
                const authorResponse = await fetch(`http://localhost:8085/api/v1/author/employee/${employeeId}`,{
          method: 'GET',
          headers:{
            Authorization: `Bearer ${token}`
          },
        });
                const authors = await authorResponse.json();
                setTotalUsers(authors.length); // Assuming this is how you get total users

                // Fetch category data
                const categoryResponse = await fetch(`http://localhost:8085/api/v1/category/employee/${employeeId}`,{
                    method: 'GET',
                    headers:{
                      Authorization: `Bearer ${token}`
                    },
                  });
                const categories = await categoryResponse.json();
                setTotalOrders(categories.length); // Assuming this is how you get total orders

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <Grid container rowSpacing={4.5} columnSpacing={2.75}>
            {/* row 1 */}
            <Grid item xs={12} sx={{ mb: -2.25 }}>
                <Typography variant="h5">Dashboard</Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Hii" count={employee_name} />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Total No. of Book" count={totalPageViews}  />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Total No. of author" count={totalUsers}  />
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={3}>
                <AnalyticEcommerce title="Total No. of category" count={totalOrders}  />
            </Grid>
           

            {/* row 3 */}
            <Grid item xs={12}>
                {/* Recent Orders Section */}
                 <h4> Recently Added</h4>
                <MainCard sx={{ mt: 2 }} content={false}>
                    {/* Your table implementation here */}
                    {bookData && (
                        <TableContainer component={Paper}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Book Name</TableCell>
                                        <TableCell align="right">Author</TableCell>
                                        <TableCell align="right">Category</TableCell>
                                        <TableCell align="right">Price</TableCell>
                                        <TableCell align="right">Quantity</TableCell>
                                        <TableCell align="right">Created At</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
    {bookData
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt descending
        .map((row) => (
            <TableRow key={row.bookId}>
                <TableCell component="th" scope="row">{row.bookName}</TableCell>
                <TableCell align="right">{row.authorName}</TableCell>
                <TableCell align="right">{row.categoryName}</TableCell>
                <TableCell align="right">{row.price}</TableCell>
                <TableCell align="right">{row.quantity}</TableCell>
                <TableCell align="right">{new Date(row.createdAt).toLocaleString()}</TableCell>
            </TableRow>
        ))}
</TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </MainCard>
            </Grid>
                  <Snackbar
                          open={snackbar.open}
                          autoHideDuration={6000}
                          onClose={handleSnackbarClose}
                        >
                          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
                            {snackbar.message}
                          </Alert>
                        </Snackbar>
        </Grid>
    );
}
