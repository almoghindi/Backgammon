import { useEffect, useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Container, Typography } from "@mui/material";
import { useHttpClient } from "../../hooks/useHttp";
import axios, { AxiosError } from "axios";

import backgammon from "../../assets/backgammon1.jpg";

interface UserDetails {
  username: string;
  stats: {
    wins: number;
    losses: number;
    points: number;
  };
}

interface UserDetailsResponse {
  user: UserDetails;
}

const UserDetails = (props: { username: string }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const { username } = props;
  const { sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const responseData = await sendRequest<UserDetailsResponse>(
          `http://localhost:3003/api/game/user-details/${username}`
        );
        if (responseData && responseData.user) {
          setUserDetails(responseData.user);
        } else {
          throw new Error("No response data");
        }
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 404) {
            setUserDetails({
              username,
              stats: {
                wins: 0,
                losses: 0,
                points: 0,
              },
            });
          }
        }
        console.log(err);
      }
    };

    fetchUserDetails();
  }, [username]);

  if (!userDetails) {
    return <LoadingSpinner />;
  }
  return (
    <Container sx={{ width: "max-content" }}>
      <img src={backgammon} alt="backgammon" style={{ height: "300px" }} />
      <Typography variant="h3">{userDetails.username}</Typography>
      <Typography variant="h5">Rank {userDetails.stats.points}</Typography>
      <Typography>
        W/L {userDetails.stats.wins}/{userDetails.stats.losses}
      </Typography>
    </Container>
  );
};

export default UserDetails;
