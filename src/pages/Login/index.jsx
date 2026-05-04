import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Link,
  IconButton,
  InputAdornment,
  Paper,
  Grid,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
// import { useAuth } from "@/contexts/AuthContext";
// import bgImage from "@/assets/login-background.png";
import { colors } from "@/theme";
import { useAuth } from "../../contexts/AuthContext";
import Input from "../../components/common/input";
import CustomButton from "../../components/common/Button";
import { mt } from "date-fns/locale";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      const response = await login(
        formData.email,
        formData.password,
        formData.rememberMe,
      );
      console.log("Login response:", response);
      // navigate("/");
    } catch (error) {
      console.log("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ height: "100vh", bgcolor: colors.white }}>
      <Grid container sx={{ height: "100%" }}>
        {/* LEFT SIDE - IMAGE */}
        <Grid item xs={false} sm={6}>
          <Box
            sx={{ p: 2, height: "100%", display: { xs: "none", sm: "block" } }}
          >
            <Box
              sx={{
                height: "100%",
                backgroundImage: `url("/login-background.png")`, // Leading slash refers to the public folder
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "center",
                position: "relative",
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              {/* overlay */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  zIndex: 1,
                }}
              />

              {/* text */}
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  height: "100%",
                  p: 4,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  paddingBottom: "130px",
                  gap: 1.5,
                  color: "white",
                }}
              >
                <Typography
                  variant="h5"
                  className="font-ArialRounded"
                  sx={{
                    lineHeight: 1,
                    fontWeight: 400,
                    fontFamily: '"ArialRounded", Arial, sans-serif',
                  }}
                >
                  Welcome Back to
                </Typography>

                <Typography
                  variant="h3"
                  sx={{
                    lineHeight: 1,
                    fontWeight: 400,
                    paddingBottom: "22px",
                    fontFamily: '"ArialRounded", Arial, sans-serif',
                  }}
                >
                  ShapeUp4Life
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: '"ArialRounded", Arial, sans-serif',
                    fontWeight: 400,
                  }}
                >
                  Sign in to continue your 12-week programme
                </Typography>
              </Box>
            </Box>
          </Box>
        </Grid>

        {/* RIGHT SIDE - FORM */}
        <Grid
          item
          xs={12}
          sm={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            bgcolor: colors.white,
            p: 3,
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "start",
                alignItems: "flex-start",
                mt: 2,
              }}
            >
<Box 
  component="img" 
  src="/logo.png"  // Leading slash refers to the public folder
  alt="Logo" 
  sx={{ height: 130 }} 
/>            </Box>

            <Box
              sx={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              {/* TITLE */}
              <Box sx={{ textAlign: "left", mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 600,
                    mb: 1,
                    fontFamily: '"ArialRounded", Arial, sans-serif',
                  }}
                >
                  Login
                </Typography>
              </Box>

              <form onSubmit={handleSubmit}>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  helperText={errors.email}
                />

                <Input
                  label="Password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  helperText={errors.password}
                />
                <div style={{ marginTop: "30px" }}>
                  <CustomButton
                    fullWidth
                    type="submit"
                    variant="contained"
                    disabled={loading}
                    sx={{
                      height: 56,
                      bgcolor: colors.primary,
                      "&:hover": { bgcolor: colors.darkPurple },
                    }}
                    text={loading ? "Logging in..." : "Login"}
                  />
                </div>
              </form>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Login;
