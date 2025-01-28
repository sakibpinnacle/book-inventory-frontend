// import PropTypes from "prop-types";
// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Snackbar from '@mui/material/Snackbar';
// import Alert from '@mui/material/Alert';

// // material-ui
// import {
//   Button,
//   Checkbox,
//   Divider,
//   FormControlLabel,
//   FormHelperText,
//   Grid,
//   InputAdornment,
//   IconButton,
//   InputLabel,
//   OutlinedInput,
//   Stack,
//   Typography,
//   Link,
// } from "@mui/material";

// // third party
// import * as Yup from "yup";
// import { Formik } from "formik";

// // project import
// import AnimateButton from "components/@extended/AnimateButton";
// import FirebaseSocial from "./FirebaseSocial";

// // assets
// import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
// import { DevicesFoldSharp } from "@mui/icons-material";

// // Helper function to verify the token
// const verifyToken = () => {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     return false;
//   }
//   try {
//     const payload = JSON.parse(atob(token.split(".")[1]));
//     const currentTime = Math.floor(Date.now() / 1000);
//     return payload.exp > currentTime; // Check if the token is still valid
//   } catch (error) {
//     console.error("Error verifying token:", error);
//     return false;
//   }
// };

// const AuthForgot = ({ isDemo = false }) => {

//   const navigate = useNavigate();
  
  
//   const [checked, setChecked] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [apiError, setApiError] = useState("");
//     const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
//   // const navigate = useNavigate();
//   //dfsfsd
// //   fdgdfg
// //   fdgdfg
// //   sgfdsfg
// //   dgfdfgdf
 
//   const handleClickShowPassword = () => {
//     setShowPassword(!showPassword);
//   };
//   const handleSnackbarClose = () => {
//     setSnackbar({ ...snackbar, open: false });
//   };
//   const handleMouseDownPassword = (event) => {
//     event.preventDefault();
//   };

  
//   return (
//     <>
//       <Formik
//         initialValues={{
//           email: "",
//           password: "",
//         }}
//         validationSchema={Yup.object().shape({
//           email: Yup.string()
//             .email("Must be a valid email")
//             .max(255)
//             .required("Email is required"),
//           password: Yup.string().max(255).required("Password is required"),
//         })}
//         onSubmit={(values, { setSubmitting }) => {
//           setApiError(""); // Clear previous errors
//           handleLogin(values, setSubmitting);
//         }}
//       >
//         {({
//           errors,
//           handleBlur,
//           handleChange,
//           handleSubmit,
//           isSubmitting,
//           touched,
//           values,
//         }) => (
//           <form noValidate onSubmit={handleSubmit}>
//             <Grid container spacing={3}>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="email-login">Email Address</InputLabel>
//                   <OutlinedInput
//                     id="email-login"
//                     type="email"
//                     value={values.email}
//                     name="email"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     placeholder="Enter email address"
//                     fullWidth
//                     error={Boolean(touched.email && errors.email)}
//                   />
//                 </Stack>
//                 {touched.email && errors.email && (
//                   <FormHelperText error id="standard-weight-helper-text-email-login">
//                     {errors.email}
//                   </FormHelperText>
//                 )}
//               </Grid>
//               <Grid item xs={12}>
//                 <AnimateButton>
//                   <Button
//                     disableElevation
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     send password
//                   </Button>
//                 </AnimateButton>
//               </Grid>
//               <Grid item xs={12}>
//                 <Stack spacing={1}>
//                   <InputLabel htmlFor="password-login">Password</InputLabel>
//                   <OutlinedInput
//                     fullWidth
//                     error={Boolean(touched.password && errors.password)}
//                     id="password-login"
//                     type={showPassword ? "text" : "password"}
//                     value={values.password}
//                     name="password"
//                     onBlur={handleBlur}
//                     onChange={handleChange}
//                     endAdornment={
//                       <InputAdornment position="end">
//                         <IconButton
//                           aria-label="toggle password visibility"
//                           onClick={handleClickShowPassword}
//                           onMouseDown={handleMouseDownPassword}
//                           edge="end"
//                           color="secondary"
//                         >
//                           {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
//                         </IconButton>
//                       </InputAdornment>
//                     }
//                     placeholder="Enter password"
//                   />
//                 </Stack>
//                 {touched.password && errors.password && (
//                   <FormHelperText error id="standard-weight-helper-text-password-login">
//                     {errors.password}
//                   </FormHelperText>
//                 )}
//               </Grid>
             
//               {apiError && (
//                 <Grid item xs={12}>
//                   <FormHelperText error>{apiError}</FormHelperText>
//                 </Grid>
//               )}
//               <Grid item xs={12}>
//                 <AnimateButton>
//                   <Button
//                     disableElevation
//                     disabled={isSubmitting}
//                     fullWidth
//                     size="large"
//                     type="submit"
//                     variant="contained"
//                     color="primary"
//                   >
//                     Upgrade password
//                   </Button>
//                 </AnimateButton>
//               </Grid>
              
//             </Grid>
//           </form>
//         )}
//       </Formik>
//        <Snackbar
//               open={snackbar.open}
//               autoHideDuration={6000}
//               onClose={handleSnackbarClose}
//             >
//               <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
//                 {snackbar.message}
//               </Alert>
//             </Snackbar>
//     </>
//   );
// };

// AuthForgot.propTypes = {
//   isDemo: PropTypes.bool,
// };

// export default AuthForgot;

// export { verifyToken };















import PropTypes from "prop-types";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputAdornment,
  IconButton,
  InputLabel,
  OutlinedInput,
  Stack,
} from "@mui/material";

// third party
import * as Yup from "yup";
import { Formik } from "formik";

// project import
import AnimateButton from "components/@extended/AnimateButton";

// assets
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";

// Helper function to send new password email
//   const navigate = useNavigate();
const handleSendPassword = async (email, setSnackbar) => {
  try {
    const response = await fetch('http://localhost:8085/api/v1/employee/send-new-password', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const message = await response.text();
console.log(response)
    if (response.ok) {
      setSnackbar({ open: true, message: "New password sent to your email.", severity: 'success' });
    } else {
      setSnackbar({ open: true, message: message || "Email not found.", severity: 'error' });
    }
  } catch (error) {
    console.error("API Error:", error);
    setSnackbar({ open: true, message: "Error sending email.", severity: 'error' });
  }
};



const AuthForgot = ({ isDemo = false }) => {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const navigate = useNavigate(); // Hook to navigate






  // Helper function to upgrade password
const handleUpgradePassword = async (email, newPassword, setSnackbar) => {
    try {
      const response = await fetch('http://localhost:8085/api/v1/employee/verify-and-update-password', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, enteredPassword: newPassword }),
      });
  
      const message = await response.text();
      console.log(message)
      const subStr = message.substring(0,16);
      console.log(subStr)
  
      if (subStr=="Login successful") {
        localStorage.setItem('token', message.replace('Login successful', ''));
        console.log(localStorage.getItem('token'));

        setSnackbar({ open: true, message: "Password updated successfully.", severity: 'success' });
        navigate("/dashboard");
      } else {
        setSnackbar({ open: true, message: message || "Failed to update password.", severity: 'error' });
      }
    } catch (error) {
      console.error("API Error:", error);
      setSnackbar({ open: true, message: "Error updating password.", severity: 'error' });
    }
  };




  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <>
      {/* First Form: Send New Password */}
      <Formik
        initialValues={{ email: "" }}
        validationSchema={Yup.object().shape({
          email: Yup.string()
            .email("Must be a valid email")
            .max(255)
            .required("Email is required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          setEmail(values.email); // Store the email for the second form
          handleSendPassword(values.email, setSnackbar);
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="email-send">Email Address</InputLabel>
                  <OutlinedInput
                    id="email-send"
                    type="email"
                    name="email"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    fullWidth
                    error={Boolean(touched.email && errors.email)}
                  />
                </Stack>
                {touched.email && errors.email && (
                  <FormHelperText error>{errors.email}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Send New Password
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      {/* Second Form: Upgrade Password */}
      <Formik
        initialValues={{ password: "" }}
        validationSchema={Yup.object().shape({
          password: Yup.string().max(255).required("Password is required"),
        })}
        onSubmit={(values, { setSubmitting }) => {
          handleUpgradePassword(email, values.password, setSnackbar);
          setSubmitting(false);
        }}
      >
        {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched }) => (
          <form noValidate onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Stack spacing={1}>
                  <InputLabel htmlFor="password-upgrade">New Password</InputLabel>
                  <OutlinedInput
                    fullWidth
                    error={Boolean(touched.password && errors.password)}
                    id="password-upgrade"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={(event) => event.preventDefault()}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter new password"
                  />
                </Stack>
                {touched.password && errors.password && (
                  <FormHelperText error>{errors.password}</FormHelperText>
                )}
              </Grid>
              <Grid item xs={12}>
                <AnimateButton>
                  <Button
                    disableElevation
                    disabled={isSubmitting}
                    fullWidth
                    size="large"
                    type="submit"
                    variant="contained"
                    color="primary"
                  >
                    Upgrade Password
                  </Button>
                </AnimateButton>
              </Grid>
            </Grid>
          </form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

AuthForgot.propTypes = {
  isDemo: PropTypes.bool,
};

export default AuthForgot;

// export { verifyToken };
