import PropTypes from 'prop-types';
// material-ui
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// third-party
import { NumericFormat } from 'react-number-format';

// project import
import Dot from 'components/@extended/Dot';

function createData(tracking_no, name, fat, carbs, protein) {
  return { tracking_no, name, fat, carbs, protein };
}
const OrdersTable = ({ data, loading }) => {
  if (loading) {
    return <CircularProgress />;
  }

  return (
    <TableContainer>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Book Name</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Author</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>ISBN</TableCell>
            <TableCell>Rating</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Quantity</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((book) => (
            <TableRow key={book.bookId}>
              <TableCell>{book.bookName}</TableCell>
              <TableCell>{book.description}</TableCell>
              <TableCell>{book.authorName || 'N/A'}</TableCell>
              <TableCell>{book.categoryName}</TableCell>
              <TableCell>{book.isbnNo}</TableCell>
              <TableCell>{book.rating}</TableCell>
              <TableCell>${book.price}</TableCell>
              <TableCell>{book.quantity}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;