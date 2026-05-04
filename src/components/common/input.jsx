import { Box, TextField, Typography } from "@mui/material";

const Input = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
  error,
  helperText,
}) => {
  return (
    <Box sx={{ mb: 2 }}>
      {/* LABEL */}
      {label && (
        <Typography
          sx={{
            mb: 1,
            fontSize: 16,
            fontStyle: "italic",
            fontFamily: '"ArialRounded", Arial, sans-serif',
          }}
        >
          {label}
        </Typography>
      )}

      {/* INPUT */}
      <TextField
        fullWidth
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        error={Boolean(error)}
        helperText={helperText}
        variant="outlined"
        sx={{
          fontStyle: "italic",
          fontFamily: '"ArialRounded", Arial, sans-serif',

          "& .MuiOutlinedInput-root": {
            borderRadius: "50px",

            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #ddd",
            },

            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#ccc",
            },
          },

          "& .MuiInputBase-input": {
            padding: "15px 14px",
          },
        }}
      />
    </Box>
  );
};

export default Input;
