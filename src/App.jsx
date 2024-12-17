import React, { useEffect, useState } from "react";
import { Container, Card, Typography, Grid, Box, Paper } from "@mui/material";
import axios from "axios"; // Import axios for making HTTP requests

const calculateThreat = (spo2, pulse, temperature) => {
  if (spo2 < 90 && pulse > 100 && temperature < 38) return { status: "Hypoxia or Respiratory Distress", color: "red" };
  if (spo2 < 90 && temperature > 38 && pulse > 100) return { status: "Severe Infection or ARDS", color: "red" };
  if (spo2 > 94 && temperature > 38 && pulse > 100) return { status: "Underlying Infection or Hyperthermia", color: "orange" };
  if (spo2 > 94 && temperature < 35 && pulse < 60) return { status: "Hypothermia or Metabolic Slowdown", color: "orange" };
  if (spo2 < 90 && temperature < 35 && pulse < 60) return { status: "Severe Hypothermia or Collapse", color: "red" };
  if (spo2 > 95 && pulse > 120) return { status: "Cardiovascular Stress or Anemia", color: "orange" };
  return { status: "Normal", color: "green" };
};

function App() {
  const [data, setData] = useState({
    spo2: 0,
    pulse: 0,
    temperature: 0,
    latitude: 0,
    longitude: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/health");
      setData(response.data); // Set the data from API response
      setLoading(false); // Set loading to false when data is fetched
    } catch (err) {
      setError("Failed to fetch data from API");
      setLoading(false);
    }
  };

  // Fetch data every 5 seconds
  useEffect(() => {
    fetchData(); // Initial fetch
    const interval = setInterval(fetchData, 5000); // Fetch data every 5 seconds

    return () => clearInterval(interval); // Cleanup the interval when component unmounts
  }, []);

  const threat = calculateThreat(data.spo2, data.pulse, data.temperature);

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h4" align="center" gutterBottom>
            Health Monitoring Dashboard
          </Typography>
          <Typography variant="h6" align="center" color="textSecondary">
            Loading data...
          </Typography>
        </Paper>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ marginTop: 5 }}>
        <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
          <Typography variant="h4" align="center" gutterBottom>
            LifeTrace : Real Time Health Monitoring Anywhere
          </Typography>
          <Typography variant="h6" align="center" color="error">
            {error}
          </Typography>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ marginTop: 5 }}>
      <Paper elevation={3} sx={{ padding: 3, backgroundColor: "#f5f5f5" }}>
        <Typography variant="h4" align="center" gutterBottom>
          Health Monitoring Dashboard
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6">SPO2 Level</Typography>
              <Typography variant="h4" color="primary">
                {data.spo2}%
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6">Pulse Rate</Typography>
              <Typography variant="h4" color="primary">
                {data.pulse} bpm
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6">Body Temperature</Typography>
              <Typography variant="h4" color="primary">
                {data.temperature}°C
              </Typography>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card sx={{ padding: 2, backgroundColor: threat.color, color: "white", textAlign: "center" }}>
              <Typography variant="h5">Threat: {threat.status}</Typography>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ padding: 2 }}>
              <Typography variant="h6" gutterBottom>
                Location
              </Typography>
              <Box>
                <iframe
                  title="location"
                  width="100%"
                  height="300px"
                  style={{ border: 0 }}
                  src={`https://www.google.com/maps?q=${data.latitude},${data.longitude}&output=embed`}
                  allowFullScreen
                ></iframe>
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default App;
