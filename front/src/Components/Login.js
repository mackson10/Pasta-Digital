import React, { useState, useContext } from "react";
import {
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  makeStyles
} from "@material-ui/core";
import { userContext, errorContext } from "../App";
import api from "../services/api";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const { setError } = useContext(errorContext);
  const { fetchUser } = useContext(userContext);
  const submitHandler = async function(e) {
    e.preventDefault();
    try {
      const { data: loginData } = await api.post("/auth", {
        username,
        password
      });

      api.defaults.headers["x-auth-token"] = loginData.token;
      localStorage.token = loginData.token;

      fetchUser();
    } catch (e) {
      setError(e.response.data.error);
    }
  };

  const canSubmit = () => username.length >= 6 && password.length >= 6;

  const classes = useStyles();

  return (
    <Paper
      className={classes.root}
      style={{
        margin: "5px",
        padding: "10px",
        width: "200px",
        textAlign: "center"
      }}
    >
      <Typography style={{ fontWeight: "bold" }}>Login</Typography>
      <form onSubmit={submitHandler}>
        <Box>
          <TextField
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
            required
            variant="outlined"
            placeholder="usuário"
          ></TextField>
        </Box>
        <Box>
          <TextField
            variant="outlined"
            type="password"
            placeholder="senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
          ></TextField>
        </Box>
        <Button type="submit" disabled={!canSubmit()} variant="outlined">
          Confirmar
        </Button>
      </form>
    </Paper>
  );
}

export default Login;

const useStyles = makeStyles(theme => ({
  root: {
    "& > form > *": {
      marginBottom: "15px"
    }
  }
}));
