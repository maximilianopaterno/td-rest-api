/* Donde se definen las rutas las cuales se van a utilizar en los distintos metodos que se van a usar como getAll */

import { Router } from "express";
import { libro } from "./controller.js";

export const router = Router()

router.get('/libros', libro.getAll);
router.get('/libros/:id', libro.getOne);
