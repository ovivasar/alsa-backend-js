const pool = require('../db');

const obtenerTodosProductos = async (req,res,next)=> {
    try {
        const todosRegistros = await pool.query("select id_producto, nombre from mst_producto order by id_producto");
        res.json(todosRegistros.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};
const obtenerProducto = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mst_producto where id_producto = $1",[id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Producto no encontrado"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearProducto = async (req,res,next)=> {
    //const {id_usuario,nombres} = req.body
    const {nombre,descripcion,siglas} = req.body
    try {
        const result = await pool.query("INSERT INTO mst_producto(nombre,descripcion,siglas) VALUES ($1,$2,$3) RETURNING *", 
        [   
            nombre,
            descripcion,
            siglas
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarProducto = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("delete from mst_producto where id_producto = $1",[id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Zona no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarProducto = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const {nombre,descripcion,siglas} = req.body
 
        const result = await pool.query("update mst_producto set nombre=$1,descripcion=$2,siglas=$3 where id_zona=$4",[nombre,descripcion,siglas,id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Producto no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodosProductos,
    obtenerProducto,
    crearProducto,
    eliminarProducto,
    actualizarProducto
 }; 