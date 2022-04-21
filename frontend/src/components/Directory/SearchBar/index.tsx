import React from "react";
import { Paper, InputBase, Tooltip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearchTermChange: (newValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {
  const { onSearchTermChange } = props;

  return (
    <Paper className={styles.container}>
      <div className={styles.searchBar}>
        <InputBase
          placeholder="Search by name..."
          inputProps={{ "aria-label": "search" }}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            onSearchTermChange(e.target.value);
          }}
          className={styles.searchInput}
        />
        <Tooltip title="Search">
          <SearchIcon />
        </Tooltip>
      </div>
    </Paper>
  );
};

export default SearchBar;
