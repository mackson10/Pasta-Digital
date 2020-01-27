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
import { errorContext } from "../App";

export default function CreateDialog({ handleClose, folder, docs, setDocs }) {
  const [title, setTitle] = useState("");
  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(false);
  const { setError } = useContext(errorContext);

  const fileChange = e => {
    setFile(e.target.files[0]);
  };

  const canSubmit = title.length > 0 && docs.every(doc => doc.title !== title);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: newDoc } = await api.post("/documents", {
        folderId: folder._id,
        title
      });

      const data = new FormData();
      data.append("0", file);

      if (file) {
        await api.put(`/documents/${newDoc._id}/extract`, data);
      }
      setDocs(s => [...s, newDoc]);
      handleClose(newDoc);
    } catch (e) {
      setError(e.response.data.error || "Error inesperado, tente novamente");
    }
    setLoading(false);
  };

  return (
    <Dialog
      onClose={() => handleClose()}
      aria-labelledby="customized-dialog-title"
      open={true}
    >
      <form onSubmit={handleSubmit}>
        <DialogTitle id="customized-dialog-title" onClose={() => handleClose()}>
          Novo documento na pasta "{folder.name}"
        </DialogTitle>
        {loading ? <LinearProgress /> : null}
        <DialogContent dividers>
          <Typography gutterBottom>
            Título:
            <TextField
              style={{ marginLeft: "10px" }}
              onChange={e => setTitle(e.target.value)}
              value={title}
            />
          </Typography>
          <Typography gutterBottom>
            Extrair .txt/.pdf (opcional)
            <Button
              style={{ margin: "0 0 0 10px" }}
              component="label"
              color="primary"
              variant="contained"
            >
              {file ? "Trocar" : "Escolher"}
              <input
                id="filetoextract"
                name="filetoextract"
                type="file"
                onChange={fileChange}
                style={{ display: "none" }}
                accept=".txt,.pdf"
              />
            </Button>
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
