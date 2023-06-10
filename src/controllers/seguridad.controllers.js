const pool = require('../db');

const obtenerTodosMenuComandosVista = async (req,res,next)=> {
    try {
        const {id_usuario,id_menu} = req.params;
        let strSQL;
        strSQL = "SELECT mad_menucomando.id_comando,";
        strSQL = strSQL + " (lpad('',length(mad_menucomando.id_comando),' ')||mad_menucomando.nombre)::varchar(100) as nombre,mad_seguridad_comando.id_empresa";
        strSQL = strSQL + " FROM";
        strSQL = strSQL + " mad_menucomando LEFT JOIN mad_seguridad_comando";
        strSQL = strSQL + " ON (mad_menucomando.id_comando = mad_seguridad_comando.id_comando and";
        strSQL = strSQL + " '" + id_usuario + "' = mad_seguridad_comando.id_usuario and";
        strSQL = strSQL + " 1 = mad_seguridad_comando.id_empresa )";
        strSQL = strSQL + " WHERE mad_menucomando.id_menu like '" + id_menu + "%'";
        strSQL = strSQL + " GROUP BY mad_menucomando.id_comando,mad_menucomando.nombre,mad_seguridad_comando.id_empresa";
        strSQL = strSQL + " ORDER BY mad_menucomando.id_comando";
    
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};
const obtenerTodosMenuComandos = async (req,res,next)=> {
    try {
        const {id_usuario,id_menu} = req.params;
        let strSQL;
        strSQL = "SELECT id_comando";
        strSQL = strSQL + " FROM mad_seguridad_comando";
        strSQL = strSQL + " WHERE id_menu like '" + id_menu + "%'";
        strSQL = strSQL + " AND id_usuario = '" + id_usuario + "'";
        strSQL = strSQL + " ORDER BY id_comando";
        console.log(strSQL);
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerTodosMenu = async (req,res,next)=> {
    try {
        const {id_usuario} = req.params;
        let strSQL;
        strSQL = "SELECT id_menu FROM mad_seguridad_comando";
        strSQL = strSQL + " WHERE id_usuario = '" + id_usuario + "'";
        strSQL = strSQL + " GROUP BY id_menu";
        strSQL = strSQL + " ORDER BY id_menu";
        
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

};

const registrarMenuComando = async (req,res,next)=> {
    const {
        id_empresa,     //01
        id_usuario,     //02    
        id_menu,        //03    
        id_comando      //04
    } = req.body

    try {
        const result = await pool.query("INSERT INTO mad_seguridad_comando VALUES ($1,$2,$3,$4) RETURNING *", 
        [   
            id_empresa,     //01
            id_usuario,     //02    
            id_menu,        //03    
            id_comando      //04
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const registrarUsuario = async (req,res,next)=> {
    try {
        //Esta vez usaremos solo parametros para un POST
        const {id_usuario,nombre} = req.params;
        let strSQL;

        strSQL = "SELECT id_usuario FROM mad_usuario";
        strSQL = strSQL + " WHERE id_usuario = '" + id_usuario + "'";
        var todosReg = await pool.query(strSQL);
        if (todosReg.rows.length === 0) {
            //El correo no existe, insertar nuevo registro
            const strInsercion = 'INSERT INTO mad_usuario (id_usuario, nombre) VALUES ($1, $2) RETURNING *';
            todosReg = await pool.query(strInsercion, [id_usuario, nombre]);
            res.json(todosReg.rows[0]);
            console.log('Usuario nuevo registrado correctamente.');
        }else{
            console.log('El correo ya existe en la tabla.');
            res.json(todosReg.rows);
            //return;
        }
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarMenuComando = async (req,res,next)=> {
    try {
        const {id_usuario,id_comando} = req.params;
        let strSQL;
        strSQL = "delete from mad_seguridad_comando";
        strSQL = strSQL + "where id_empresa = 1";
        strSQL = strSQL + "and id_usuario = $1";
        strSQL = strSQL + "and id_comando = $2";

        const result = await pool.query(strSQL,[id_usuario,id_comando]);

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
    obtenerTodosMenuComandosVista,
    obtenerTodosMenuComandos,
    obtenerTodosMenu,
    registrarMenuComando,
    registrarUsuario,
    eliminarMenuComando,
 }; 