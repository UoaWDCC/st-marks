import React from "react";
import { Box, IconButton, Tooltip, Switch } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Room as RoomIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";
import { useCookies } from "react-cookie";




interface NavBarProps {
  contrast?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ contrast = false }: NavBarProps) => {
  const theme = useTheme();
  const color = contrast
    ? theme.palette.primary.contrastText
    : theme.palette.primary.main;

  const [cookies, setCookie] = useCookies(["darkMode"]);
  const [mode, setMode] = React.useState(false);

  function darkModeOn() {
    setCookie("darkMode", "true", {
      path: "/"
    });
  }
  function darkModeOff() {
    setCookie("darkMode", "false", {
      path: "/"
    });
  }

  return (
    <Box className={styles.topBarIcons}>
      <Tooltip title="Directory" placement="right">
        <IconButton
          component={Link}
          to="/directory"
          data-testid="directory-button"
          className={styles.clickable}
          size="large"
        >
          <MenuBookIcon htmlColor={color} fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Home" placement="bottom">
        <IconButton
          component={Link}
          to="/"
          data-testid="home-button"
          className={styles.clickable}
          size="large"
        >
          <HomeIcon htmlColor={color} fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Map" placement="left">
        <Switch
          checked={mode}
          onChange={() => {
            if (mode) {
              darkModeOn();
            } else {
              darkModeOff();
            }
            setMode(!mode);
          }
          }
          className={styles.clickable}
        />
      </Tooltip>
    </Box>
  );
};

export default NavBar;
