import { Link, useNavigate } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
import AuthLogin from './auth-forms/AuthLogin';
import { useState } from 'react';

// ================================|| LOGIN ||================================ //

export default function Login() {

  // const navigate = useNavigate();

  // const handleCreateNew = () => {
  //   navigate('/signup');
  // };

  // const [formData, setFormData] = useState({
  //   email: '',
  //   password: '',
  // });

  // const [passwordVisible, setPasswordVisible] = useState(false); // For toggling password visibility
  // const [errorMessage, setErrorMessage] = useState('');
  // const [successMessage, setSuccessMessage] = useState('');

  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   setFormData((prevData) => ({ ...prevData, [name]: value }));
  // };

  // const handleLogin = async () => {
  //   try {
  //     const response = await fetch('http://localhost:8085/api/v1/employee/login', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({
  //         email: formData.email,
  //         password: formData.password,
  //       }),
  //     });

  //     const data = await response.json();

  //     if (data.status) {
  //       setSuccessMessage(data.message);
  //       setErrorMessage('');
  //       setTimeout(() => {
  //         navigate('/dashboard');
  //       }, 2000);
  //     } else {
  //       setErrorMessage('Invalid login credentials');
  //     }
  //   } catch (error) {
  //     setErrorMessage('Login failed. Please try again.');
  //     setSuccessMessage('');
  //   }
  // };
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Login</Typography>
            <Typography component={Link} to="/register" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Don&apos;t have an account?
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <AuthLogin />
        </Grid>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            {/* <Typography variant="h3">Login</Typography> */}
            <Typography component={Link} to="/forgot" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              forgot password
            </Typography>
          </Stack>
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
