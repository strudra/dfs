import Express from "express";

import ClientController from "./controllers/ClientController";
import StorageController from "./controllers/StorageController";
import Middleware from "./controllers/Middleware";

const router = Express.Router();

// ping/pong response from server
router.get("/ping", ClientController.pong);

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
router.post("/file", ClientController.writeFile);
router.get("/file", ClientController.readFile);

// routes for directories
router.get(
  "/ls",
  [Middleware.validatePath, Middleware.validateDirectory],
  ClientController.readDirectory
);
router.get("/dir", ClientController.openDirectory);
router.post("/mkdir", ClientController.makeDirectory);
router.delete("/dir", ClientController.deleteDirectory);

// routes for storage servers
router.post("/register", StorageController.register);

export default router;
