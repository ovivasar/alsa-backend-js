const pool = require('../db');

const obtenerTodasOCargas = async (req,res,next)=> {
    let strSQL;
    strSQL = "select zona_venta";
    strSQL = strSQL + " ,cast(comprobante_original_fecemi as varchar)::varchar(50) as comprobante_original_fecemi";
    strSQL = strSQL + " ,tipo_op";
    strSQL = strSQL + " ,(comprobante_original_codigo";
    strSQL = strSQL + "   || '-' || comprobante_original_serie";
    strSQL = strSQL + "   || '-' || comprobante_original_numero)::varchar(50) as pedido";
    strSQL = strSQL + " ,vendedor";
    strSQL = strSQL + " ,razon_social";
    strSQL = strSQL + " ,comprobante_original_codigo";
    strSQL = strSQL + " ,comprobante_original_serie";
    strSQL = strSQL + " ,comprobante_original_numero";
    strSQL = strSQL + " ,elemento";
    strSQL = strSQL + " from";
    strSQL = strSQL + " mve_venta";
    strSQL = strSQL + " order by comprobante_original_fecemi, razon_social";

    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerFechaInicial = (strFechaProceso) => {
    //click llega normal: yyyy-mm-dd
    //caso contrario, procesar las partes y ordenarlo formato yyyy-mm-dd
    let strFechaIni= "";
    //let datePieces = strFechaProceso.split("-");
    //const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00
    const fechaArmada = new Date(strFechaProceso); //ok con hora 00:00:00
    let sMes = (fechaArmada.getMonth()+1).toString(); // ok, se aumenta +1, por pinche regla js
    sMes = sMes.padStart(2,'0');
    let sAno = (fechaArmada.getFullYear()).toString(); 
    strFechaIni = sAno + "-" + sMes + "-01";

    return strFechaIni;
};
const obtenerTodasOCargasPlan = async (req,res,next)=> {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    let strFechaIni;
    const {fecha_proceso} = req.params;
    //calcular fecha inicio, segun fecha proceso
    strFechaIni = obtenerFechaInicial(fecha_proceso);

    //console.log(strFechaIni);
    strSQL = "SELECT cast(fecha as varchar)::varchar(50) as fecha";
    strSQL = strSQL + " ,(ref_cod || '-' || ref_serie || '-' || ref_numero)::varchar(50) as pedido";    
    strSQL = strSQL + " ,zona_entrega"; //usar coalesce(prioridad,secundario)
    strSQL = strSQL + " ,numero";
    strSQL = strSQL + " ,item";
    strSQL = strSQL + " ,guia";
    strSQL = strSQL + " ,operacion";
    strSQL = strSQL + " ,ticket";
    strSQL = strSQL + " ,descripcion";
    strSQL = strSQL + " ,razon_social";
    strSQL = strSQL + " ,desag_sacos";
    strSQL = strSQL + " ,desag_tn";
    strSQL = strSQL + " ,llega_sacos";
    strSQL = strSQL + " ,operacion2";
    strSQL = strSQL + " ,sacos_transb";
    strSQL = strSQL + " ,sacos_descar";
    strSQL = strSQL + " ,lote_asignado";
    strSQL = strSQL + " ,sacos_carga";
    strSQL = strSQL + " ,lote_procedencia";
    strSQL = strSQL + " ,sacos_final";
    strSQL = strSQL + " ,tara_desag";

    strSQL = strSQL + " ,e_peso";
    strSQL = strSQL + " ,e_monto";
    strSQL = strSQL + " ,e_razon_social";
    strSQL = strSQL + " ,e_rh";
    strSQL = strSQL + " ,e_hora_ini";
    strSQL = strSQL + " ,e_hora_fin";
    strSQL = strSQL + " ,e_estibadores";
    strSQL = strSQL + " ,e_observacion";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " ,cast(date_part('year',fecha) as varchar) as ano";
    
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mst_ocarga_detalle ";
    strSQL = strSQL + " WHERE fecha BETWEEN '" + strFechaIni + "' and '" + fecha_proceso + "'";
    strSQL = strSQL + " ORDER BY fecha, numero, item";

    try {
        //console.log(strSQL);
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerOCarga = async (req,res,next)=> {
    try {
        const {ano,numero} = req.params;
        let strSQL ;
        
        strSQL = "SELECT ";
        strSQL = strSQL + "  id_empresa";
        strSQL = strSQL + " ,id_punto_venta";
        strSQL = strSQL + " ,cast(fecha as varchar)::varchar(50) as fecha";
        strSQL = strSQL + " ,numero";
        strSQL = strSQL + " ,registrado";
        strSQL = strSQL + " FROM mst_ocarga";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        const result = await pool.query(strSQL,[ano,numero]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Orden de Carga no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearOCarga = async (req,res,next)=> {
    let strSQL;
    var sAno;
    const {
        id_empresa,        //1
        id_punto_venta,        //1
        fecha, //6
        registrado      //11
        } = req.body

    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    let datePieces = fecha.split("-");
    const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00
    
    console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    console.log(sAno);

    strSQL = "INSERT INTO mst_ocarga";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
    strSQL = strSQL + " ,id_punto_venta";
    strSQL = strSQL + " ,fecha";
    strSQL = strSQL + " ,ano";
    strSQL = strSQL + " ,numero";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,'" + sAno + "'";
    strSQL = strSQL + " ,(select * from fst_genera_ocarga($1,'" + sAno + "'))";
    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,        //1
            id_punto_venta,    //2
            fecha,      //3
            registrado  //4
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarOCarga = async (req,res,next)=> {
    try {
        const {ano,numero} = req.params;
        var strSQL;
        strSQL = "DELETE FROM mst_ocarga ";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        
        const result = await pool.query(strSQL,[ano,numero]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarOCarga = async (req,res,next)=> {
    try {
        const {ano,numero} = req.params;
        const {fecha} = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga SET ";
        strSQL = strSQL + "  fecha = $1";
        strSQL = strSQL + " WHERE ano = $2";
        strSQL = strSQL + " AND numero = $3";
        console.log(strSQL,[fecha,ano,numero]);

        const result = await pool.query(strSQL,
        [   
            fecha,
            ano,
            numero
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodasOCargas,
    obtenerTodasOCargasPlan,
    obtenerOCarga,
    crearOCarga,
    eliminarOCarga,
    actualizarOCarga
 }; 