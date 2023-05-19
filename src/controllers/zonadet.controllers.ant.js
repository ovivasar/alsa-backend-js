const pool = require('../db');

const obtenerTodasZonasDet100 = async (req,res,next)=> {
    var strSQL;
    try {
        strSQL = "SELECT mve_zonadet.id_zonadet";  
        strSQL = strSQL + " ,(mve_zonadet.siglas || '-'|| mve_zonadet.nombre)::varchar(50) as nombre"
        strSQL = strSQL + " ,mve_zona.nombre as nombre_zona";
        strSQL = strSQL + " FROM ";
        strSQL = strSQL + " mve_zonadet LEFT JOIN mve_zona";
        strSQL = strSQL + " ON (mve_zonadet.id_zona = mve_zona.id_zona)";
        strSQL = strSQL + " ORDER BY mve_zonadet.id_zonadet";
        const result = await pool.query(strSQL);
        //console.log(strSQL);
        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Zubzonas no encontradas"
            });

        res.json(result.rows);
    } catch (error) {
        console.log(error.message);
    }
};

const obtenerTodasZonasDet = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mve_zonadet where id_zona = $1 order by id_zonadet",[id]);

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
        const {id,iddet} = req.params;
        const result = await pool.query("select * from mve_zonadet where id_zona=$1 and id_zonadet=$2",[id,iddet]);

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
    const {id_zona,nombre,descripcion,siglas} = req.body
    try {
        const result = await pool.query("INSERT INTO mve_zonadet (id_zona,nombre,descripcion,siglas) VALUES ($1,$2,$3,$4) RETURNING *", 
        [   id_zona,
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
        const {id,iddet} = req.params;
        const result = await pool.query("delete from mve_zonadet where id_zona = $1 and id_zonadet = $2",[id,iddet]);

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
        const {id,iddet} = req.params;
        const {nombre,descripcion,siglas} = req.body
 
        const result = await pool.query("update mve_zonadet set nombre=$1,descripcion=$2,siglas=$3 where id_zona=$4 and id_zonadet=$5",[nombre,descripcion,siglas,id,iddet]);

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
    obtenerTodasZonasDet100,
    obtenerTodasZonasDet,
    obtenerZonaDet,
    crearZonaDet,
    eliminarZonaDet,
    actualizarZonaDet
 };