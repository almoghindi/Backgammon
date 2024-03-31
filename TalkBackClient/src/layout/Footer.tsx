import React from "react";
import { Box, Container, Typography, IconButton, Stack } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        py: 3,
        position: "fixed",
        left: 0,
        bottom: 0,
        width: "100%",
        zIndex: -1,
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" align="center" gutterBottom>
          Follow Us
        </Typography>
        <Stack direction="row" justifyContent="center" spacing={2}>
          <IconButton aria-label="Facebook" color="primary">
            <FacebookIcon />
          </IconButton>
          <IconButton aria-label="Twitter" color="primary">
            <TwitterIcon />
          </IconButton>
          <IconButton aria-label="Instagram" color="primary">
            <InstagramIcon />
          </IconButton>
        </Stack>
        <Typography variant="subtitle1" align="center" color="textSecondary">
          Contact Us: +123-456-7890
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
