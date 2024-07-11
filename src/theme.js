import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "Lato",
  },
  palette: {
    primary: {
      light: "#45c09f",
      main: "#00a278",
      dark: "#00845c",
      contrastText: "#fff",
    },
    text: {
      contrastText: "#000000",
    },
    secondary: {
      main: "#00a278",
    },
  },
});

export default theme;
