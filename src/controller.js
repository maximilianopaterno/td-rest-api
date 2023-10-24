/* Aqui se definiran todas las funcionalidades (consultas en este caso) que realizara nuestra app */

import { pool } from "./database.js";

class LibroController {

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM libros');
        res.json(result);
    }
    
    async getOne(req, res){
        try {
            const id = req.params.id;
            const [result] = await pool.query(`SELECT * FROM libros WHERE id=(?)`, [id]);
            if (result.length === 0) {
                throw new Error('Libro no encontrado.');
            }
            res.json(result[0]);
        } catch (error) {
            console.error(error);
            res.status(404).json({ error: 'El id buscado es inexistente.' });
        }
    }
}
    
 
export const libro = new LibroController()
