import TextField from '@mui/material/TextField';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { useState } from 'react';
import * as addDays from 'date-fns/addDays';

export const useDateSelector = () => {
  const [date, setDate] = useState<Date | null>(new Date());
  const DateSelector = () => (
    <div>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MobileDatePicker
          label='Date mobile'
          inputFormat='MM/dd/yyyy'
          value={date}
          onChange={(value) => {
            setDate(value);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onWheel={(e) => {
                if (e.deltaY && date !== null) {
                  const change = e.deltaY / Math.abs(e.deltaY);
                  setDate(addDays.default(date, change));
                }
              }}
            />
          )}
        />
      </LocalizationProvider>
    </div>
  );
  return { date, setDate, DateSelector };
};
