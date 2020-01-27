import React, { useState, useEffect, useContext } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
  makeStyles
} from "@material-ui/core";

import api from "../services/api";
import { errorContext } from "../App";

export default function DocumentDialog({ handleClose, folder, selectedDoc }) {
  const [loading, setLoading] = useState(true);
  const [loadedDoc, setLoadedDoc] = useState(null);
  const { setError } = useContext(errorContext);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get("/documents/" + selectedDoc._id);
        setLoadedDoc(data);
      } catch (e) {}
      setLoading(false);
    })();
  }, [selectedDoc._id]);

  const handleSave = async e => {
    setLoading(true);
    try {
      await api.put("/documents/" + selectedDoc._id, {
        content: loadedDoc.content
      });
    } catch (e) {
      setError(e.response.data.error || "Error inesperado, tente novamente");
    }
    setLoading(false);
  };

  const classes = useStyles();

  return (
    <Dialog
      className={classes.root}
      maxWidth="lg"
      onClose={handleClose}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <DialogTitle id="customized-dialog-title" onClose={handleClose}>
        Editando documento: "usuário/{folder.name}/{selectedDoc.title}"
      </DialogTitle>
      {loading ? <LinearProgress /> : null}
      <DialogContent className={"content"}>
        {loadedDoc ? (
          <textarea
            onChange={e =>
              setLoadedDoc({ ...loadedDoc, content: e.target.value })
            }
            value={loadedDoc.content}
          ></textarea>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSave} type="submit" color="primary">
          Salvar
        </Button>
        <Button onClick={handleClose} type="submit" color="primary">
          Sair
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    padding: "0",
    "& .content": {
      textAlign: "center",
      padding: "0",
      width: "70vw",
      height: "70vh",
      "& textarea": {
        padding: "10px",
        border: "1px solid #eee",
        userSelect: "none",
        resize: "none",
        width: "95%",
        height: "95%"
      },
      "& textarea:focus": {
        outline: "1px solid #ccc"
      }
    }
  }
}));
