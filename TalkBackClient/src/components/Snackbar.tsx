import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface SnackbarProps {
  snackbarOpen: boolean;
  setSnackbarOpen: (value: React.SetStateAction<boolean>) => void;
  snackbarMessage: string;
  severity: "success" | "error" | "info";
}

const SnackbarComponent: React.FC<SnackbarProps> = ({
  snackbarOpen,
  setSnackbarOpen,
  snackbarMessage,
  severity,
}) => {
  return (
    <Snackbar
      open={snackbarOpen}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      autoHideDuration={4000}
      onClose={() => setSnackbarOpen(false)}
      key={snackbarMessage}
    >
      <Alert
        onClose={() => setSnackbarOpen(false)}
        severity={severity}
        sx={{ width: "100%" }}
      >
        {snackbarMessage}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarComponent;
