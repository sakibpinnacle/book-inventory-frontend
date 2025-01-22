import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import { Button, Typography, Stack } from "@mui/material";

const Logout = ({ message = "Are you sure you want to log out?" }) => {
  const navigate = useNavigate();

  // Check for the token and redirect to login if not present
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleLogout = () => {
    // Clear token from localStorage
    localStorage.removeItem("token");

    // Redirect to login page
    navigate("/login");
  };

  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{ height: "100vh", textAlign: "center" }}
    >
      <Typography variant="h5">{message}</Typography>
      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
        >
          Yes, Log Out
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => navigate(-1)} // Navigate back to the previous page
        >
          Cancel
        </Button>
      </Stack>
    </Stack>
  );
};

Logout.propTypes = {
  message: PropTypes.string,
};

export default Logout;
