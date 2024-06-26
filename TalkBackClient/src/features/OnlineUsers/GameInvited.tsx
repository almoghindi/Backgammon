// GameInvite.tsx
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import GameModal from "../../components/Modal";

interface GameInviteProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
  username: string;
}

const GameInviting: React.FC<GameInviteProps> = ({
  open,
  onClose,
  onAccept,
  username,
}) => {
  return (
    <>
      <GameModal open={open} onClose={onClose} title="Invite to Game">
        <Typography id="game-invite-response-title" variant="h6" component="h2">
          You got an invite from {username}!
        </Typography>
        <Box sx={{ mt: 2, display: "flex", justifyContent: "space-around" }}>
          <Button
            variant="contained"
            sx={{ bgcolor: "#087CA7" }}
            onClick={onAccept}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            sx={{ bgcolor: "#C2948A" }}
            onClick={onClose}
          >
            Deny
          </Button>
        </Box>
      </GameModal>
    </>
  );
};

export default GameInviting;
