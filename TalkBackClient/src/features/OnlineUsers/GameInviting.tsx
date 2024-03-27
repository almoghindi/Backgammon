// GameInvite.tsx
import React from "react";
import { Button, Typography, Box } from "@mui/material";
import GameModal from "../../components/Modal";

interface GameInviteProps {
  open: boolean;
  onClose: () => void;
  username: string;
}

const GameInviting: React.FC<GameInviteProps> = ({
  open,
  onClose,
  username,
}) => {
  return (
    <>
      <GameModal open={open} onClose={onClose} title="Invite to Game">
        <Typography sx={{ mt: 2 }}>
          Waiting for {username}'s response...
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button onClick={onClose} variant="contained">
            Cancel
          </Button>
        </Box>
      </GameModal>
    </>
  );
};

export default GameInviting;
