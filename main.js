import Templating from '/JS/templating.js';
import CanvasTitle from "/JS/canvas_title.js";
import pacman from "/JS/canvas_pacman.js";
const templates = new Templating



templates.importTemplate('title', 'app')
pacman()
CanvasTitle()