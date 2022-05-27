import React from "react";
import { Paper, InputBase, Tooltip } from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import styles from "./SearchBar.module.css";

import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import Dialog from '@mui/material/Dialog';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import { IDate } from "../../../types/schema";
import { dateToString } from "../../../utils/dates";

import { getDate, getMonth, getYear } from 'date-fns'
// import getMonth from 'date-fns/getMonth'
// import getYear from 'date-fns/getYear'



interface SearchBarProps {
  onSearchTermChange: (newValue: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = (props: SearchBarProps) => {

  const dateTheme = createTheme({
    palette: {
      // mode: "dark"
      // background: {
      //   paper: '#e3f2fd'
      // },
    },
  });

  const { onSearchTermChange } = props;

  const [date, setDate] = React.useState<IDate | null>(null);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  date && console.log(date, dateToString(date));


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
          <SearchIcon onClick={handleClickOpen} />
        </Tooltip>
      </div>
      <Dialog open={open} onClose={handleClose}>
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <ThemeProvider theme={dateTheme}>
            <StaticDatePicker
              className="date-picker"
              views={['day']}
              openTo="year"
              value={date}
              onChange={(newDateValue: Date | null) => {
                newDateValue &&
                  setDate({
                    year: getYear(newDateValue),
                    month: getMonth(newDateValue) + 1,
                    day: getDate(newDateValue)
                  });
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </ThemeProvider>
        </LocalizationProvider>
      </Dialog>
    </Paper >
  );
};

export default SearchBar;
