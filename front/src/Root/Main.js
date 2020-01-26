import React, { useState, useContext, useEffect, useCallback } from "react";
import {
  Container,
  Typography,
  Button,
  makeStyles,
  Select,
  MenuItem,
  CircularProgress,
  GridList,
  GridListTile
} from "@material-ui/core";
import { userContext, errorContext } from "../App";
import { Add, Description } from "@material-ui/icons";
import api from "../services/api";
import CreateDialog from "../Components/CreateDialog";
import DocumentDialog from "../Components/DocDialog";
import NewFolderDialog from "../Components/NewFolderDialog";

export default function Main() {
  const { folders } = useContext(userContext).user;
  const [folderIndex, setFolderIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [createDialog, setCreateDialog] = useState(false);

  const { setError } = useContext(errorContext);

  const [docs, setDocs] = useState([]);

  const selectedFolder = folders[folderIndex];
  const fetchFolder = useCallback(
    async function() {
      setLoading(true);
      try {
        const { data } = await api.get(`/folders/${selectedFolder._id}/docs`);
        setDocs(data);
      } catch (e) {
        setError(e.response.data.error || "Error inesperado, tente novamente");
      }

      setLoading(false);
    },
    [selectedFolder._id, setError]
  );

  const newDocHandler = function() {
    setCreateDialog(true);
  };

  useEffect(() => {
    fetchFolder();
  }, [fetchFolder]);

  const [selectedDoc, setSelectedDoc] = useState(null);

  const [newFolder, setNewFolder] = useState(false);

  const classes = useStyles();
  return (
    <Container maxWidth="md" className={classes.root}>
      <Typography variant="h5">
        Selecione uma pasta:
        <Select
          style={{ marginLeft: "20px", width: "100px" }}
          value={folderIndex}
          onChange={e => setFolderIndex(e.target.value)}
        >
          {folders.map((f, i) => (
            <MenuItem key={i} value={i}>
              {f.name}
            </MenuItem>
          ))}
        </Select>
        <Button
          onClick={() => setNewFolder(true)}
          color="primary"
          style={{ margin: "0 20px" }}
          variant="contained"
        >
          Nova Pasta
        </Button>
      </Typography>
      <Button onClick={newDocHandler} variant="outlined">
        <Add /> Novo Documento
      </Button>
      <Container className="gridContainer">
        {!loading ? (
          <GridList cellHeight={160} cols={5}>
            {docs.map((doc, i) => (
              <GridListTile
                key={i}
                onClick={() => setSelectedDoc(doc)}
                className="tile"
                cols={1}
              >
                <>
                  <Description style={{ fontSize: "120px" }} />
                  <p>{doc.title}</p>
                </>
              </GridListTile>
            ))}
          </GridList>
        ) : (
          <CircularProgress thickness={5} style={{ marginTop: "25vh" }} />
        )}
      </Container>
      {createDialog ? (
        <CreateDialog
          folder={selectedFolder}
          docs={docs}
          setDocs={setDocs}
          handleClose={newDoc => {
            setCreateDialog(false);
            if (newDoc) setSelectedDoc(newDoc);
          }}
        ></CreateDialog>
      ) : null}
      {selectedDoc ? (
        <DocumentDialog
          folder={selectedFolder}
          selectedDoc={selectedDoc}
          setDocs={setDocs}
          handleClose={() => setSelectedDoc(null)}
        ></DocumentDialog>
      ) : null}
      {newFolder ? (
        <NewFolderDialog
          folders={folders}
          handleClose={() => setNewFolder(false)}
        ></NewFolderDialog>
      ) : null}
    </Container>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    backgroundColor: "#eee",
    height: "calc(100vh - 64px)",
    padding: "30px",
    "& > *": { marginTop: "10px" },
    "& .gridContainer": {
      padding: "10px",
      overflow: "auto",
      border: "solid #cbcbcb 1px",
      textAlign: "center",
      marginTop: "15px",
      height: "calc(70vh)",
      "& p": { margin: 0, fontWeight: "600", fontSize: "18px" },
      "& .tile:hover": { backgroundColor: "#ddd" }
    }
  }
}));
