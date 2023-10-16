import mysqlConnection from 'mysql2/promise';

const properties = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rest-api'
};

/* Es el pool de conexion con la base de datos */
export const pool = mysqlConnection.createPool(properties);
