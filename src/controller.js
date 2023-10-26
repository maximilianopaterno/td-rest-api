/* Aqui se definiran todas las funcionalidades (consultas en este caso) que realizara nuestra app */

import { pool } from "./database.js";

class LibroController {

    async getAll(req, res) {
        const [result] = await pool.query('SELECT * FROM Libros');
        res.json(result);
    }

// Insertar un nuevo libro.    
    async add(req, res) {
        try {
          const libro = req.body;

// Verificar si algún campo requerido no esta en la solicitud
        const camposPermitidos = ['nombre', 'autor', 'categoria', 'añopublicacion', 'ISBN'];
        console.log(camposPermitidos);
        console.log(Object.keys(libro))
        const camposFaltantes = camposPermitidos.filter(campo => !(campo in libro)); // Filtro por los campos que no estan definidos en libro  
        if (camposFaltantes.length === 1) {
            return res.status(400).json({ error: `Falta el campo requerido: ${camposFaltantes.join(' ')}.` });
            }
        if (camposFaltantes.length > 1) {
            return res.status(400).json({ error: `Faltan los campos requeridos: ${camposFaltantes.join(', ')}.` });
            }   
        if (libro.ISBN.length < 13) {
            return res.status(400).json({ error: "Compruebe que su ISBN contenga 13 caracteres. Posee " + libro.ISBN.length + " caracteres."});
            }
            
// Verificar si algún campo contiene espacios en blanco o se completo en blanco
         const camposConEspacios = Object.keys(libro).filter(key => typeof libro[key] === 'string' && libro[key].trim() === '');
        //-------------------------------------------------------> determina si es un string lo ingresado y con trim() elimina los espacios en blancos del inicio y final  
        if (camposConEspacios.length === 1) { 
            return res.status(400).json({ error: `El campo ${camposConEspacios.join(' ')} contiene espacios en blanco o se cargo en blanco.`});
            }
        if (camposConEspacios.length > 1) { 
            return res.status(400).json({ error: `Los campos ${camposConEspacios.join(', ')} contienen espacios en blanco o se cargaron en blanco.`});
            }
      
// Verificar que solo se ingresen los campos permitidos
          const camposValidos = ['nombre', 'autor', 'categoria', 'añopublicacion', 'ISBN'];
          const camposInvalidos = Object.keys(libro).filter(campo => !camposValidos.includes(campo));
          if (camposInvalidos.length === 1) {
            return res.status(400).send(`Se cargo un campo inválido: ${camposInvalidos.join('')}.`); //Devuelve el nombre del campo invalido.
            } 
          if (camposInvalidos.length > 1) {
            return res.status(400).send(`Se cargaron campos inválidos: ${camposInvalidos.join(' , ')}.`); //Devuelve los nombre de los campos invalidos.
            };
          
          const [result] = await pool.query(`INSERT INTO Libros (nombre, autor, categoria, añopublicacion, ISBN) VALUES (?, ?, ?, ?, ?)`,
            [libro.nombre, libro.autor, libro.categoria, libro.añopublicacion, libro.ISBN]
          );
      
          res.json({ "ID insertado": result.insertId });
        } catch (error) {
          res.status(400).send(error.message);
        }
      }
      
// Eliminar un libro por ID
    async deleteId(req, res) {
        try {
            const libro = req.body;
            const [result] = await pool.query(`DELETE FROM Libros WHERE id=(?)`, [libro.id]);
            if (!libro.id || libro.id === 0) {
                throw new Error("El campo 'id' es inválido.");
                }   
            if (result.affectedRows === 0) {
                throw new Error('Ocurrio un error al intentar eliminar un libro. No se encontró un libro con el ID '+ libro.id +' proporcionado.');
            }
            res.json({"Registros eliminados": result.affectedRows});
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }
    
// Eliminar un libro por ISBN
    async deleteISBN(req, res) {
        try {
            const libro = req.body;
            const [result] = await pool.query(`DELETE FROM Libros WHERE ISBN=(?)`,[libro.ISBN]);
            if (libro.ISBN.length < 13) {
                throw new Error("El ISBN no cumple con el requisito de 13 caracteres. Posee " + libro.ISBN.length + " caracteres.");
            }
            if (result.affectedRows === 0) {
                throw new Error('No se encontró un libro con el ISBN '+libro.ISBN+' proporcionado.');
            } else {
                res.json({"ISBN eliminado": result.affectedRows});
            }
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

//Actualizar un libro por ID
    async updateId(req, res)
    {
        try {
            const libro = req.body;
            const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añopublicacion=(?), ISBN=(?)  WHERE id=(?)`,
            [libro.nombre, libro.autor, libro.categoria, libro.añopublicacion, libro.ISBN, libro.id]);
            if (!libro.id || libro.id === 0) {
            throw new Error("El campo 'id' es inválido.");
            }
            if (result.changedRows === 0) {
                throw new Error('No se ha encontrado un libro con el ID ' +libro.id+ ' proporcionado.');
            } 
            if (libro.ISBN.length < 13) {
                throw new Error("El ISBN no cumple con el requisito de 13 caracteres. Posee " + libro.ISBN.length + " caracteres.");
            }
                res.json({"Registros actualizados": result.changedRows});
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

//Actualizar un libro por ISBN
    async updateISBN(req, res)
    {
        try {
            const libro = req.body;
            const [result] = await pool.query(`UPDATE Libros SET nombre=(?), autor=(?), categoria=(?), añopublicacion=(?)  WHERE ISBN=(?)`,
            [libro.nombre, libro.autor, libro.categoria, libro.añopublicacion, libro.ISBN]);
            if (!libro.ISBN || libro.ISBN === 0) {
                throw new Error("El campo ISBN es inválido.");
            }
            if (libro.ISBN.length < 13) {
                throw new Error("El ISBN no cumple con el requisito de 13 caracteres. Posee " + libro.ISBN.length + " caracteres.");
            }
            if (result.changedRows === 0) {
                throw new Error('No se ha encontrado un libro con el ISBN '+libro.ISBN+ ' proporcionado.');
            } 
                res.json({"Registros actualizados": result.changedRows});
        } catch (error) {
            console.error(error);
            res.status(400).json({ error: error.message });
        }
    }

//Buscar un libro por ID    
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
            res.status(404).json({ error: 'El ID buscado es inexistente.'});
        }
    }
}

export const libro = new LibroController()

