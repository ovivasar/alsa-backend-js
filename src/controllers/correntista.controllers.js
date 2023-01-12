const pool = require('../db');

const obtenerTodosCorrentistas = async (req,res,next)=> {
    console.log("select documento_id, razon_social, telefono from mad_correntistas order by razon_social");
    try {
        const todosReg = await pool.query("select documento_id, razon_social, telefono from mad_correntistas order by razon_social");
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};
const obtenerCorrentista = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mad_correntistas where documento_id = $1",[id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Correntista no encontrado"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearCorrentista = async (req,res,next)=> {
    //const {id_usuario,nombres} = req.body
    const {documento_id,id_documento,razon_social,contacto,telefono,email,id_vendedor,relacionado,base} = req.body
    try {
        const result = await pool.query("INSERT INTO mad_correntistas VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *", 
        [   
            documento_id,
            id_documento,
            razon_social,
            contacto,
            telefono,
            email,
            id_vendedor,
            relacionado,
            base
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarCorrentista = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("delete from mad_correntistas where documento_id = $1",[id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Correntista no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarCorrentista = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const {razon_social,contacto,telefono,email,id_vendedor,relacionado,base} = req.body
 
        const result = await pool.query("update mad_correntistas set razon_social=$1,contacto=$2,telefono=$3,email=$4,id_vendedor=$5,relacionado=$6,base=$7 where documento_id=$8",
        [   
            razon_social,
            contacto,
            telefono,
            email,
            id_vendedor,
            relacionado,
            base,
            id
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Zona no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodosCorrentistas,
    obtenerCorrentista,
    crearCorrentista,
    eliminarCorrentista,
    actualizarCorrentista
 }; 