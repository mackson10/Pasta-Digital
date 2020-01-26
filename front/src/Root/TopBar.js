import React, { useContext, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Popover
} from "@material-ui/core";
import { FolderOpenTwoTone } from "@material-ui/icons";
import { userContext } from "../App";
import Login from "../Components/Login";

export default function TopBar() {
  const classes = useStyles();
  const { user, setUser } = useContext(userContext);

  const [loginPop, setLoginPop] = useState({ open: false });

  return (
    <AppBar position="static">
      <Toolbar>
        <FolderOpenTwoTone />
        <Typography variant="h6" className={classes.title}>
          Pasta Digital
        </Typography>
        {!user ? (
          <>
            <Button
              onClick={e =>
                setLoginPop({ anchorEl: e.currentTarget, open: true })
              }
              color="inherit"
            >
              Login
            </Button>
            <Popover
              open={loginPop.open}
              anchorEl={loginPop.anchorEl}
              onClose={() => setLoginPop({ open: false })}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "center"
              }}
            >
              <Login />
            </Popover>
          </>
        ) : (
          <>
            <Button
              onClick={() => {
                localStorage.token = undefined;
                setUser(null);
              }}
              color="inherit"
            >
              Logout
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));
