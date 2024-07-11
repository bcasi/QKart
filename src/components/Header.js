import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Avatar, Button, Stack } from "@mui/material";
import { makeStyles } from "@mui/styles";
import Box from "@mui/material/Box";
import React from "react";
import "./Header.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const useStyles = makeStyles((theme) => ({
  logoutButton: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    "&:hover, &:focus": {
      backgroundColor: theme.palette.primary.contrastText,
      color: theme.palette.primary.main,
    },
  },
}));

// const useStyles = makeStyles({
//   logoutButton: {
//     backgroundColor: "#45c09f",
//     color: "#fff",
//   },
// });

const Header = ({ children, hasHiddenAuthButtons }) => {
  const history = useHistory();
  const username = localStorage.getItem("username");

  const classes = useStyles();

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box className="header">
      <Box className="header-title">
        <img src="logo_light.svg" alt="QKart-icon"></img>
      </Box>
      <Box className="search-space">{children}</Box>
      {hasHiddenAuthButtons ? (
        <Button
          className="explore-button"
          startIcon={<ArrowBackIcon />}
          variant="text"
          onClick={() => {
            history.push("/");
          }}
        >
          Back to explore
        </Button>
      ) : !username ? (
        <Stack direction="row" spacing={2}>
          <Button
            onClick={() => {
              history.push("/login");
            }}
          >
            Login
          </Button>
          <Button
            className={classes.logoutButton}
            onClick={() => {
              history.push("/register");
            }}
          >
            Register
          </Button>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" spacing={2}>
          <Avatar alt={username} src="public/avatar.png" />
          <p>{username}</p>
          <Button onClick={handleLogout}>Logout</Button>
        </Stack>
      )}
    </Box>
  );
};

export default Header;
