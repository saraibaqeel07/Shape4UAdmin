import { Box, Grid, Typography } from "@mui/material";
import { BookOpen, Users, Building2, BookType, Library } from "lucide-react";
import { colors } from "@/theme";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
console.log("Dashboard component loaded");
import api from "@/services/api";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  console.log("Dashboard rendering");
  const getData = async () => {
    try {
      const response = await api.get("admin/dashboard");
      if (response.data) {
        console.log("response of data:", response.data);
        setData(response.data);
      }
    } catch (error) {
      console.log("error geeeting dashbaord:", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const stats = [
    {
      title: "Total Weeks",
      navigate: "/weeks",
      value: data?.weeks || 0,
      color: colors.blue,
      bgColor: colors.fadedBlue,
    },
    {
      title: "Active Users",
      value: data?.users || 0,
      navigate: "/users",
      color: colors.green,
      bgColor: colors.fadedGreen,
    },
  ];

  const cardColors = ["#1F7FB6", "#7FB33B", "#DD303D", "#262525"];

  return (
    <Box>
      <Typography
        variant="h4"
        mb={4}
        sx={{
          color: colors.dimBlack,
          fontWeight: 600,
          fontFamily: '"ArialRounded", Arial, sans-serif',
        }}
      >
        Dashboard Overview
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Box
              onClick={() => navigate(stat?.navigate)}
              sx={{
                p: 3,
                bgcolor: `${cardColors[index % 4]}`,
                borderRadius: 8,
                minHeight: 180,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between", // ⭐ key fix
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
                transition: "transform 0.2s ease-in-out",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: "0 6px 16px rgba(0, 0, 0, 0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    color: colors.white,
                    fontWeight: 300,
                    fontFamily: '"Montserrat", sans-serif',
                  }}
                >
                  {stat.title}
                </Typography>

                <Typography
                  sx={{
                    color: colors.green,
                    fontWeight: 500,
                    fontSize: "0.875rem",
                  }}
                >
                  {stat.trend}
                </Typography>
              </Box>

              {/* BOTTOM VALUE */}
              <Typography
                variant="h4"
                sx={{
                  color: colors.white,
                  fontWeight: 600,
                  fontFamily: '"Montserrat", sans-serif',
                }}
              >
                {stat.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Dashboard;
