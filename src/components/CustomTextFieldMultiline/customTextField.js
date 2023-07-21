import React from "react";

import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { styled } from "@mui/material/styles";

const CustomTextFieldMultiline = styled(TextField)({
  "& .MuiInputBase-root":{
    paddingRight: "30px", 
  },
  "& label.Mui-focused": {
    color: "#7689AE",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#7689AE",
  },
  "& .MuiFormHelperText-root": {
    color: "#7689AE",
  },
  "& .MuiFormLabel-root": {
    color: "#7689AE",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#D5D8F0",
    },
    "&:hover fieldset": {
      borderColor: "#7689AE",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#7689AE",
    },
    "&.Mui-focused .MuiIconButton-root": { color: "#7689AE" },
  },
});
export const CustomFieldMultiline = ({
  label,
  helperText,
  value,
  handler,
  handleClear,
  rows,
  sx
}) => {
  return (
    <CustomTextFieldMultiline
      sx={sx}
      required
      fullWidth
      multiline
      rows={rows}
      id="outlined-basic"
      label={label}
      variant="outlined"
      helperText={helperText}
      value={value}
      onChange={(e) => handler(e.target.value)}
      InputProps={{
        endAdornment: (
          <IconButton
            sx={{
              visibility: value ? "visible" : "hidden",
              top: 0,
              right: 0,
              position: "absolute",
              color: "#D5D8F0",
            }}
            onClick={() => handleClear("")}
          >
            <CancelOutlinedIcon />
          </IconButton>
        ),
      }}
    />
  );
};
