/* Donde se definen las rutas las cuales se van a utilizar en los distintos metodos que se van a usar como getAll */

import { Router } from "express";
import { libro } from "./controller.js";

export const router = Router()

//--------->(Ruta para postman, metodo)
router.get('/libros', libro.getAll);
router.get('/libros/:id', libro.getOne);
router.post('/libro', libro.add);
router.delete('/libro/ISBN', libro.deleteISBN);
router.delete('/libro/id', libro.deleteId);
router.put('/libro', libro.updateISBN);
router.put('/libro/id', libro.updateId);
