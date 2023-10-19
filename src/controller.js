/* Aqui se definiran todas las funcionalidades (consultas en este caso) que realizara nuestra app */

import { pool } from "./database.js";

class LibroController {

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }

    async add(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`INSERT INTO Libros (nombre, autor, categoria, añopublicacion, ISBN) VALUES (?, ?, ?, ?, ?)`,
        [libro.nombre, libro.autor, libro.categoria, libro.añopublicacion, libro.ISBN]);
        res.json({"ID insertado": result.insertId });
    }

    async delete(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
        res.json({"Registros eliminados": result.affectedRows});
    }

    async deleteISBN(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN=(?)`, [libro.ISBN]);
        res.json({"ISBN eliminado": result.affectedRows});
    }
  
    async update(req, res) {
        const libro = req.body;
        const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añopublicacion=(?), ISBN=(?)`,
        [libro.nombre, libro.autor, libro.categoria, libro.añopublicacion, libro.ISBN]);
        res.json({"Registros actualizados": result.changedRows});
    }
    async getOne(req,res) {
            try {
                const libro = req.body;
                const [result] = await pool.query('SELECT * FROM libros WHERE id=?', [libro.id]);
                if (result[0] != undefined) {
                    res.json(result);
                } else {
                    res.json({"Error": "No se encontro libro con el ID indicado."});
                }
            } catch(e) {
                console.log(e);
            }
    }

export const libro = new LibroController()
