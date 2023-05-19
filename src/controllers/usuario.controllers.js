const pool = require('../db');

const obtenerTodosUsuarios = async (req,res,next)=> {
    //console.log("select nombre,email,dni,telefono,vendedor,supervisor,activo from mad_usuario order by nombre");
    try {
        const todosReg = await pool.query("select id_usuario,nombre,email,dni,telefono,vendedor,supervisor,activo from mad_usuario order by nombre");
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }
};
const obtenerTodosVendedor = async (req,res,next)=> {
    //console.log("select nombre,email,dni,telefono,vendedor,supervisor,activo from mad_usuario where vendedor='1' order by nombre");
    try {
        const todosReg = await pool.query("select id_usuario as id_vendedor,nombre,email,dni,telefono,vendedor,supervisor,activo from mad_usuario where vendedor='1' order by nombre");
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }
};

const obtenerUsuario = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("select * from mad_usuario where id_usuario = $1",[id]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Usuario no encontrado"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearUsuario = async (req,res,next)=> {
    const {id_usuario,nombre,email,dni,telefono,vendedor,supervisor,activo,anfitrion} = req.body
    try {
        var strSQL;
        strSQL = "INSERT INTO mad_usuario ";
        strSQL = strSQL + " (id_usuario,nombre,email,dni,telefono,ctrl_insercion) RETURNING *";
        strSQL = strSQL + " VALUES ($1,$2,$3,$4,$5,current_timestamp) RETURNING *";
        const result = await pool.query(strSQL, 
        [   
            id_usuario,
            nombre,
            email,
            dni,
            telefono,
            vendedor,
            activo,
            anfitrion
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarUsuario = async (req,res,next)=> {
    try {
        const {id} = req.params;
        const result = await pool.query("delete from mad_usuario where id_usuario = $1",[id]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Usuario no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarUsuario = async (req,res,next)=> {
    try {
        var strSQL;
        const {id} = req.params;
        const {nombre,email,dni,telefono,vendedor,supervisor,activo,anfitrion} = req.body
        strSQL = "update mad_usuario set";
        strSQL = strSQL + "  nombre=$1";
        strSQL = strSQL + " ,email=$2";
        strSQL = strSQL + " ,dni=$3";
        strSQL = strSQL + " ,telefono=$4";
        strSQL = strSQL + " ,vendedor=$5";
        strSQL = strSQL + " ,supervisor=$6";
        strSQL = strSQL + " ,activo=$7";
        strSQL = strSQL + " ,anfitrion=$8";
        strSQL = strSQL + " where id_usuario=$9";
        
        const result = await pool.query(strSQL,
        [   
            nombre,
            email,
            dni,
            telefono,
            vendedor,
            supervisor,
            activo,
            anfitrion
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
    obtenerTodosUsuarios,
    obtenerTodosVendedor,
    obtenerUsuario,
    crearUsuario,
    eliminarUsuario,
    actualizarUsuario
 }; 