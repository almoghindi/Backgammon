// GameInviteModal.tsx
import React, { ReactNode } from "react";
import { Modal, Box, Typography, SxProps, Theme } from "@mui/material";

interface GameModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const GameModal: React.FC<GameModalProps> = ({
  open,
  onClose,
  title,
  children,
}) => {
  // Styling for the modal content box
  const style: SxProps<Theme> = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "#429EA6",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="game-invite-modal-title"
      aria-describedby="game-invite-modal-description"
    >
      <Box sx={style}>
        <Typography id="game-invite-modal-title" variant="h6" component="h2">
          {title}
        </Typography>
        {children} {/* Render the dynamic content passed as children */}
      </Box>
    </Modal>
  );
};

export default GameModal;
