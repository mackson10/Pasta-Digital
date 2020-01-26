import React, { createContext, useState, useEffect, useCallback } from "react";
import { Switch, BrowserRouter, Route, Redirect } from "react-router-dom";
import { makeStyles, CircularProgress, Snackbar } from "@material-ui/core";
import {} from "@material-ui/icons";
import "./App.css";
import TopBar from "./Root/TopBar";
import Landing from "./Root/Landing";
import api from "./services/api";
import Main from "./Root/Main";

export const userContext = createContext({
  user: null,
  setUser: () => {},
  fetchUser: () => {}
});
export const errorContext = createContext({
  error: null,
  setError: () => {}
});

function App() {
  const classes = useStyles();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchUser = useCallback(async function() {
    setLoading(true);
    try {
      const { data } = await api.get("/auth/logged");
      setUser(data);
    } catch (e) {
      setError(e.response.data.error || "Error inesperado, tente novamente");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const logged = c => (user ? c : <Redirect to="/" />);
  const unlogged = c => (!user ? c : <Redirect to="/folders" />);

  return (
    <BrowserRouter>
      <userContext.Provider value={{ user, setUser, fetchUser }}>
        <errorContext.Provider value={{ error, setError }}>
          {!loading ? (
            <>
              <TopBar />
              <Switch>
                <Route exact path="/">
                  {unlogged(<Landing />)}
                </Route>
                <Route path="/folders">{logged(<Main />)}</Route>
                <Route exact path="/not-found">
                  Not Found
                </Route>
                <Redirect to="/not-found"></Redirect>
              </Switch>
            </>
          ) : (
            <div style={{ textAlign: "center", margin: "40vh auto 0 auto" }}>
              <CircularProgress thickness={8} />
            </div>
          )}
          {!!error ? (
            <Snackbar
              autoHideDuration={4000}
              className={classes.snackbar}
              message={"Erro: " + error}
              open
              style={{ backgroundColor: "red" }}
              onClose={() => setError(null)}
            />
          ) : null}
        </errorContext.Provider>
      </userContext.Provider>
    </BrowserRouter>
  );
}

export default App;

export const useStyles = makeStyles(theme => ({
  snackbar: {
    "& > *": { backgroundColor: "red" }
  }
}));
