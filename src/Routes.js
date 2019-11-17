import Express from "express";

import ClientController from "./controllers/ClientController";
import StorageController from "./controllers/StorageController";
import Middleware from "./controllers/Middleware";

const router = Express.Router();

// ping/pong response from server
router.get("/ping", ClientController.pong);

// replication
router.post("/sync", StorageController.sync);

// initialize
router.post("/init", ClientController.initialize);

// routes for files
router.get(
  "/fileinfo",
  [
    Middleware.validateName,
    Middleware.validatePath,
    Middleware.validateDirectory,
    Middleware.validateFile
  ],
  ClientController.getFileInfo
);

router.post(
  "/touch",
  // not validating directory because we can create on-the-fly
  [Middleware.validateName, Middleware.validatePath],
  ClientController.createEmptyFile
);
router.post(
  "/filecopy",
  [
    Middleware.validateName,
    Middleware.validatePath,
    Middleware.validateDirectory,
    Middleware.validateFile
  ],
  ClientController.copyFile
);
router.post(
  "/filemove",
  [
    Middleware.validateName,
    Middleware.validatePath,
    Middleware.validateNewPath,
    Middleware.validateDirectory,
    Middleware.validateFile
  ],
  ClientController.moveFile
);

router.delete(
  "/file",
  [
    Middleware.validateName,
    Middleware.validatePath,
    Middleware.validateDirectory,
    Middleware.validateFile
  ],
  ClientController.deleteFile
);

// files with communication with storage servers
router.post(
  "/file",
  [Middleware.validatePath, Middleware.validateHash],
  ClientController.writeFile
);
router.get("/file", ClientController.readFile);

// routes for directories
router.get(
  "/ls",
  [Middleware.validatePath, Middleware.validateDirectory],
  ClientController.readDirectory
);
router.post(
  "/mkdir",
  [Middleware.validatePath, Middleware.validateDirectoryDoesntExist],
  ClientController.makeDirectory
);
router.delete(
  "/dir",
  [
    Middleware.validatePath,
    Middleware.validateDirectory,
    Middleware.requireForce
  ],
  ClientController.deleteDirectory
);

// TODO: peter, related to one in ClientController
router.get("/dir", ClientController.openDirectory);

// routes for storage servers
router.post(
  "/register",
  [Middleware.validateStorage],
  StorageController.register
);

router.post("/upload", ClientController.uploadFile);

export default router;
