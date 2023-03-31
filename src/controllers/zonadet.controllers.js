const pool = require('../db');


const obtenerTodasZonasDet = async (req,res,next)=> {
    try {
        const result = await pool.query("select * from mve_zonadet order by id_zonadet");

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Zubzonas no encontradas"
            });

        res.json(result.rows);
    } catch (error) {
        console.log(error.message);
    }
};

const obtenerZonaDet = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mve_zonadet where id_zonadet=$1",[id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Zubsona no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearZonaDet = async (req,res,next)=> {
    const {id_zonadet,nombre,descripcion,siglas} = req.body
    try {
        const result = await pool.query("INSERT INTO mve_zonadet (id_zonadet,nombre,descripcion,siglas) VALUES ($1,$2,$3,$4) RETURNING *", 
        [   id_zonadet,
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

const eliminarZonaDet = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("delete from mve_zonadet where id_zonadet = $1",[id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Subzona no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarZonaDet = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const {nombre,descripcion,siglas} = req.body
        //var strSQL;
        //strSQL = "update mve_zonadet set nombre=$1,descripcion=$2,siglas=$3,id_zona=$4 where id_zonadet=$5",[nombre,descripcion,siglas,id_zona,id];
        //console.log(strSQL);
        const result = await pool.query("update mve_zonadet set nombre=$1,descripcion=$2,siglas=$3 where id_zonadet=$4",[nombre,descripcion,siglas,id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Subzona no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodasZonasDet,
    obtenerZonaDet,
    crearZonaDet,
    eliminarZonaDet,
    actualizarZonaDet
 };