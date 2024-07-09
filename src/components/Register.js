import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement the register function
  /**
   * Definition for register handler
   * - Function to be called when the user clicks on the register button or submits the register form
   *
   * @param {{ username: string, password: string, confirmPassword: string }} formData
   *  Object with values of username, password and confirm password user entered to register
   *
   * API endpoint - "POST /auth/register"
   *
   * Example for successful response from backend for the API call:
   * HTTP 201
   * {
   *      "success": true,
   * }
   *
   * Example for failed response from backend for the API call:
   * HTTP 400
   * {
   *      "success": false,
   *      "message": "Username is already taken"
   * }
   */
  const register = async (formData) => {
    console.log(config.endpoint);
    const url = config.endpoint + "/auth/register";
    try {
      const sendData = await axios.post(url, formData);
      console.log(sendData);
      const resp = await sendData.data;

      return resp;
    } catch (err) {
      return err;
    }
  };

  // TODO: CRIO_TASK_MODULE_REGISTER - Implement user input validation logic
  /**
   * Validate the input values so that any bad or illegal values are not passed to the backend.
   *
   * @param {{ username: string, password: string, confirmPassword: string }} data
   *  Object with values of username, password and confirm password user entered to register
   *
   * @returns {boolean}
   *    Whether validation has passed or not
   *
   * Return false if any validation condition fails, otherwise return true.
   * (NOTE: The error messages to be shown for each of these cases, are given with them)
   * -    Check that username field is not an empty value - "Username is a required field"
   * -    Check that username field is not less than 6 characters in length - "Username must be at least 6 characters"
   * -    Check that password field is not an empty value - "Password is a required field"
   * -    Check that password field is not less than 6 characters in length - "Password must be at least 6 characters"
   * -    Check that confirmPassword field has the same value as password field - Passwords do not match
   */
  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;
    const variant = { variant: "warning" };
    let validationError = false;

    if (!username) {
      enqueueSnackbar("Username is a required field", variant);
      return (validationError = true);
    }

    if (!password) {
      enqueueSnackbar("Password is a required field", variant);
      return (validationError = true);
    }

    if (username.length <= 5) {
      enqueueSnackbar("Username must be at least 6 characters", variant);
      return (validationError = true);
    }

    if (password.length <= 5) {
      enqueueSnackbar("Password must be at least 6 characters", variant);
      return (validationError = true);
    }

    if (!confirmPassword || confirmPassword !== password) {
      enqueueSnackbar("Passwords do not match", variant);
      return (validationError = true);
    }
    return validationError;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsRegistering(true);

    const validationError = validateInput(formData);

    if (validationError) {
      setIsRegistering(false);
    }

    const { username, password } = formData;

    if (!validationError) {
      const registerUser = await register({ username, password });

      if (registerUser.success) {
        const variant = { variant: "success" };
        enqueueSnackbar("Registered Successfully", variant);
        setIsRegistering(false);
      } else {
        const variant = { variant: "error" };

        if (registerUser.response) {
          enqueueSnackbar(registerUser.response.data.message, variant);
          setIsRegistering(false);
        }

        if (!register.reponse) {
          enqueueSnackbar(
            "Something went wrong. Check that the backend is running, reachable and returns valid JSON.",
            variant
          );
          setIsRegistering(false);
        }
      }
    }

    return;
  };

  const handleUserName = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, username: value }));
  };

  const handlePassword = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, password: value }));
  };

  const handleConfirmPassword = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, confirmPassword: value }));
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={formData.username}
            onChange={handleUserName}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be atleast 6 characters length"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={formData.password}
            onChange={handlePassword}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={formData.confirmPassword}
            onChange={handleConfirmPassword}
          />
          {isRegistering ? (
            <div className="circular">
              <CircularProgress color="success" />
            </div>
          ) : (
            <Button
              className="button"
              onClick={handleSubmit}
              variant="contained"
            >
              Register Now
            </Button>
          )}
          <p className="secondary-action">
            Already have an account?{" "}
            <a className="link" href="#">
              Login here
            </a>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;