import React, { useState, useContext } from "react";
import {
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress
} from "@material-ui/core";

import api from "../services/api";
import { userContext, errorContext } from "../App";

export default function NewFolderDialog({ handleClose, folders }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(userContext);
  const { setError } = useContext(errorContext);

  const canSubmit = folders.every(f => f.name !== name);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: newFolder } = await api.post("/folders", {
        name
      });
      setUser(u => ({ ...u, folders: [...folders, newFolder] }));
      handleClose();
    } catch (e) {
      setError(e.response.data.error || "tente novamente");
    }
    setLoading(false);
  };

  return (
    <Dialog
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="customized-dialog-title" onClose={handleClose}>
          Criação de pasta
        </DialogTitle>
        {loading ? <LinearProgress /> : null}
        <DialogContent dividers>
          <Typography gutterBottom>
            Nome:
            <TextField
              style={{ marginLeft: "10px" }}
              onChange={e => setName(e.target.value)}
              value={name}
            />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            disabled={!canSubmit}
            onClick={handleSubmit}
            type="submit"
            color="primary"
          >
            Criar
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
