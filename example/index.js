import DotRouter from "../framework/DotRouter.js";
import App from "./App.js";

const router = new DotRouter();
router.addRoute("/", new App());
router.navigate("/");