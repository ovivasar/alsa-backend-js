const pool = require('../db');

const obtenerTodosPermisoComandosVista = async (req,res,next)=> {
    try {
        const {id_usuario} = req.params;
        let strSQL;
        strSQL = "SELECT mad_menucomando.id_comando";
        //strSQL = strSQL + " ,(mad_menucomando.id_comando || ' ' || mad_menucomando.nombre)::varchar(200) as nombre";
        strSQL = strSQL + " ,rtrim(ltrim(mad_menucomando.nombre))::varchar(200) as nombre";
        strSQL = strSQL + " ,mad_menucomando.descripcion";
        strSQL = strSQL + " ,mad_seguridad_comando.id_comando as id_permiso";
        strSQL = strSQL + " FROM"; 
        strSQL = strSQL + " mad_menucomando LEFT JOIN mad_seguridad_comando";
        strSQL = strSQL + " ON (mad_menucomando.id_comando = mad_seguridad_comando.id_comando and";
        strSQL = strSQL + "     mad_seguridad_comando.id_usuario like '" + id_usuario + "%'";
        strSQL = strSQL + "    )";
        strSQL = strSQL + " ORDER BY mad_menucomando.id_comando";
    
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};
const obtenerTodosPermisoComandos = async (req,res,next)=> {
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
const obtenerTodosEmail = async (req,res,next)=> {
    try {
        let strSQL;
        strSQL = "SELECT id_usuario";
        strSQL = strSQL + " FROM"; 
        strSQL = strSQL + " mad_seguridad_comando";
        strSQL = strSQL + " GROUP BY id_usuario";
        strSQL = strSQL + " ORDER BY id_usuario";
    
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const registrarPermisoComando = async (req,res,next)=> {
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

const eliminarPermisoComando = async (req,res,next)=> {
    try {
        const {id_usuario,id_comando} = req.params;
        let strSQL;
        strSQL = "DELETE FROM mad_seguridad_comando";
        strSQL = strSQL + " WHERE id_empresa = 1";
        strSQL = strSQL + " AND id_usuario = $1";
        strSQL = strSQL + " AND id_comando = $2";

        const result = await pool.query(strSQL,[id_usuario,id_comando]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Email Usuario no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const eliminarPermisoUsuario = async (req,res,next)=> {
    try {
        const {id_usuario} = req.params;
        let strSQL;
        strSQL = "DELETE FROM mad_seguridad_comando";
        strSQL = strSQL + " WHERE id_empresa = 1";
        strSQL = strSQL + " AND id_usuario = $1";

        const result = await pool.query(strSQL,[id_usuario]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Email Usuario no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodosPermisoComandosVista,
    obtenerTodosPermisoComandos,
    obtenerTodosMenu,
    obtenerTodosEmail,
    registrarPermisoComando,
    registrarUsuario,
    eliminarPermisoComando,
    eliminarPermisoUsuario
 }; 