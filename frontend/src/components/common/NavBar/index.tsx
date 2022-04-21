import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  Home as HomeIcon,
  MenuBook as MenuBookIcon,
  Room as RoomIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

interface NavBarProps {
  contrast?: boolean;
}

const NavBar: React.FC<NavBarProps> = ({ contrast = false }: NavBarProps) => {
  const theme = useTheme();
  const color = contrast
    ? theme.palette.primary.contrastText
    : theme.palette.primary.main;

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
        <IconButton
          component={Link}
          to="/map"
          data-testid="map-button"
          className={styles.clickable}
          size="large"
        >
          <RoomIcon htmlColor={color} fontSize="large" />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NavBar;
