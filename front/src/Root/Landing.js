import React, { useState, useContext } from "react";
import {
  Container,
  Typography,
  Button,
  makeStyles,
  Card,
  TextField,
  Box
} from "@material-ui/core";
import api from "../services/api";

import { userContext, errorContext } from "../App";

export default function Landing() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const { fetchUser } = useContext(userContext);
  const { setError } = useContext(errorContext);

  const submitHandler = async function(e) {
    e.preventDefault();
    try {
      await api.post("/auth/register", {
        username,
        password,
        name
      });

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

  const canSubmit = () =>
    username.length >= 6 && password.length >= 6 && name.length >= 6;

  const classes = useStyles();
  return (
    <Container maxWidth="sm" className={classes.root}>
      <Typography
        className="mainTitle"
        variant="h2"
        component="h2"
        gutterBottom
      >
        Tudo num lugar só.
      </Typography>
      <Typography variant="h5" component="h2" gutterBottom>
        Registre-se agora e começe a organizar suas pastas e criar documentos de
        qualquer lugar.
      </Typography>
      <form onSubmit={submitHandler}>
        <Card className="card">
          <Box>
            <Typography className="cardTitle">Cadastro</Typography>
          </Box>
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
          <Box>
            <TextField
              required
              variant="outlined"
              placeholder="nome"
              value={name}
              onChange={e => setName(e.target.value)}
            ></TextField>
          </Box>
          <Button type="submit" disabled={!canSubmit()} variant="outlined">
            Confirmar
          </Button>
        </Card>
      </form>
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    borderRadius: "40px",
    marginTop: "30px",
    backgroundColor: "#ccc",
    textAlign: "center",
    "& > .mainTitle": { marginTop: "20px" },
    "& .card": {
      border: "solid 2px",
      width: "250px",
      margin: "30px auto 0 auto",
      padding: "10px",
      backgroundColor: "#fff",
      "& .cardTitle": {
        fontSize: "22px",
        fontWeight: "bold"
      },
      "& > *": {
        margin: "15px"
      }
    }
  }
}));
