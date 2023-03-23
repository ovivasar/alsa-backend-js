const pool = require('../db');

const obtenerTodosCorrentistas = async (req,res,next)=> {
    //console.log("select documento_id, razon_social, telefono from mad_correntistas order by razon_social");
    try {
        const todosReg = await pool.query("select * from mad_correntistas order by id_documento, razon_social");
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
    const {
        documento_id,   //01
        id_documento,   //02    
        razon_social,   //03    
        codigo,         //04
        contacto,       //05
        telefono,       //06
        telefono2,      //07
        email,          //08
        email2,         //09
        id_vendedor,    //10
        id_zonadet      //11
    } = req.body

    try {
        const result = await pool.query("INSERT INTO mad_correntistas VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *", 
        [   
        documento_id,   //01
        id_documento,   //02    
        razon_social,   //03    
        codigo,         //04
        contacto,       //05
        telefono,       //06
        telefono2,      //07
        email,          //08
        email2,         //09
        id_vendedor,    //10
        id_zonadet      //11
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
    let strSQL;
    try {
        const {id} = req.params;
        const { razon_social,   //01
                codigo,         //02
                contacto,       //03
                telefono,       //04
                telefono2,      //05
                email,          //06
                email2,         //07
                id_vendedor,    //08
                id_zonadet,     //09
                //relacionado,    //10
                //base            //11
            } = req.body

        strSQL = " UPDATE mad_correntistas SET";
        strSQL = strSQL + "  razon_social=$1";
        strSQL = strSQL + " ,codigo=$2";
        strSQL = strSQL + " ,contacto=$3";
        strSQL = strSQL + " ,telefono=$4";
        strSQL = strSQL + " ,telefono2=$5";
        strSQL = strSQL + " ,email=$6";
        strSQL = strSQL + " ,email2=$7";
        strSQL = strSQL + " ,id_vendedor=$8";
        strSQL = strSQL + " ,id_zonadet=$9";
        //strSQL = strSQL + " ,relacionado=$10";
        //strSQL = strSQL + " ,base=$11";
        strSQL = strSQL + "  WHERE documento_id=$10";
        const result = await pool.query(strSQL,
        [   
            razon_social,   //01
            codigo,         //02
            contacto,       //03
            telefono,       //04
            telefono2,      //05
            email,          //06
            email2,         //07
            id_vendedor,    //08
            id_zonadet,     //09
            //relacionado,    //10
            //base,           //11
            id              //10
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Correntista no encontrado"
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