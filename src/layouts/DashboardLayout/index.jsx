import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // Added useLocation
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Avatar,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Group,
  Logout,
  NotificationsOutlined,
  Weekend,
  Book,
  MenuBook,
} from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { colors } from "@/theme";
// import Logo from "@/assets/logo.png";
import HomeIcon from "@mui/icons-material/Home";

const DRAWER_WIDTH = 300;

const DashboardLayout = () => {
  const [open, setOpen] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation(); // Hook to track current path
  const { logout, user } = useAuth();

  const handleProfileClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const menuItems = [
    { title: "Dashboard", icon: <HomeIcon />, path: "/" },
    { title: "Users", icon: <Group />, path: "/users" },
    { title: "Weeks Program", icon: <MenuBook />, path: "/weeks" },
  ];

  const isCurrentPath = (path) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        maxWidth: "100vw",
        overflowX: "hidden",
      }}
    >
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1, // Keep AppBar above Drawer
          bgcolor: colors.white,
          boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              onClick={() => setOpen(!open)}
              edge="start"
              sx={{ color: colors.dimBlack, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              noWrap
              sx={{
                color: colors.dimBlack,
                fontWeight: 600,
                fontFamily: '"Montserrat", sans-serif',
              }}
            >
              Shape For Life Admin
            </Typography>
          </Box>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Badge
              badgeContent={4}
              // sx={{ cursor: "pointer" }}
              sx={{
                cursor: "pointer",
                "& .MuiBadge-badge": {
                  backgroundColor: "#7FB33B",
                  color: "#fff",
                },
              }}
            >
              <NotificationsOutlined sx={{ color: colors.dimBlack }} />
            </Badge>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                cursor: "pointer",
              }}
              onClick={handleProfileClick}
            >
              <Avatar
                sx={{
                  bgcolor: colors.lightPurple,
                  color: "#7FB33B",
                  width: 35,
                  height: 35,
                }}
              >
                {user?.firstName?.[0] || "A"}
              </Avatar>
              <Typography
                sx={{
                  color: colors.dimBlack,
                  fontWeight: 500,
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                {user?.firstName || "Admin"}
              </Typography>
            </Box>

            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  navigate("/profile");
                }}
              >
                Profile
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: open ? DRAWER_WIDTH : 0,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#f6f7fb",
            borderRight: `1px solid ${colors.lightGrey}`,
            display: "flex",
            flexDirection: "column",
          },
        }}
      >
        <Toolbar />

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 2,
          }}
        >
          <Box
            component="img"
           src="/logo.png"
            alt="Logo"
            sx={{ height: 130, objectFit: "contain" }}
          />
        </Box>

        {/* MENU */}
        <Box sx={{ display: "flex", flexDirection: "column", flex: 1 }}>
          <List sx={{ px: 2 }}>
            {menuItems.map((item) => {
              const isSelected = isCurrentPath(item.path);

              return (
                <ListItem
                  button
                  key={item.title}
                  onClick={() => navigate(item.path)}
                  sx={{
                    mb: 1.5,
                    borderRadius: 50,
                    px: 2,
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid #7FB33B",
                    bgcolor: isSelected ? "#7FB33B" : "transparent",
                    "&:hover": {
                      bgcolor: isSelected ? "#7FB33B" : colors.lightPurple,
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 36,
                      color: isSelected ? colors.white : colors.dimBlack,
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>

                  <ListItemText
                    primary={item.title}
                    primaryTypographyProps={{
                      fontWeight: isSelected ? 600 : 500,
                      color: isSelected ? colors.white : colors.dimBlack,
                      fontFamily: '"Montserrat", sans-serif',
                      fontStyle: "italic",
                    }}
                  />
                </ListItem>
              );
            })}
          </List>

          {/* BOTTOM */}
          <Box sx={{ mt: "auto", px: 2 }}>
            <ListItem
              button
              onClick={logout}
              sx={{
                mb: 2,
                borderRadius: 50,
                border: "1px solid #7FB33B",
                px: 2,
                fontFamily: '"Montserrat", sans-serif',
                fontStyle: "italic",
                "&:hover": {
                  bgcolor: colors.lightPurple,
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 36 }}>
                <Logout />
              </ListItemIcon>

              <ListItemText primary="Logout" />
            </ListItem>
          </Box>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: 3,
          width: "100%", // Ensures it doesn't try to be wider than the parent
          transition: "margin 0.3s ease",
          background: "white",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
