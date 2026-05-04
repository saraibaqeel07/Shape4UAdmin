import { Button } from "@mui/material";

const CustomButton = ({
  text,
  loading = false,
  type = "button",
  onClick,
  fullWidth = true,
  color = "#7FB33B",
  hoverColor = "#6aa32f",
}) => {
  return (
    <Button
      fullWidth={fullWidth}
      type={type}
      onClick={onClick}
      disabled={loading}
      variant="contained"
      sx={{
        height: 48,
        fontFamily: '"ArialRounded", Arial, sans-serif',
        borderRadius: "50px",
        textTransform: "none",
        fontWeight: 600,
        fontSize: "16px",
        bgcolor: color,
        "&:hover": {
          bgcolor: hoverColor,
        },
        "&.Mui-disabled": {
          bgcolor: "#ccc",
          color: "#fff",
        },
      }}
    >
      {loading ? "Loading..." : text}
    </Button>
  );
};

export default CustomButton;
