const pool = require('../db');

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
const obtenerFechaInicialAnual = (strFechaProceso) => {
    //click llega normal: yyyy-mm-dd
    //caso contrario, procesar las partes y ordenarlo formato yyyy-mm-dd
    let strFechaIni= "";
    //let datePieces = strFechaProceso.split("-");
    //const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00
    const fechaArmada = new Date(strFechaProceso); //ok con hora 00:00:00
    let sAno = (fechaArmada.getFullYear()).toString(); 
    strFechaIni = sAno + "-" + "01" + "-01";

    return strFechaIni;
};

const obtenerTodasVentas = async (req,res,next)=> {
    let strFechaIni;
    //const {fecha_proceso} = req.params;
    //calcular fecha inicio, segun fecha proceso
    //strFechaIni = obtenerFechaInicialAnual(fecha_proceso);
    const {fecha_ini,fecha_proceso} = req.params;

    let strSQL;
    strSQL = "SELECT zona_venta";
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
    strSQL = strSQL + " ,''::varchar(20) as descripcion";
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mve_venta ";
    strSQL = strSQL + " WHERE comprobante_original_fecemi BETWEEN '" + fecha_ini + "' and '" + fecha_proceso + "'";
    strSQL = strSQL + " ORDER BY comprobante_original_fecemi DESC, razon_social ASC";

    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerTodasVentasPlan = async (req,res,next)=> {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    let strFechaIni;
    //const {fecha_proceso} = req.params;
    const {fecha_ini,fecha_proceso} = req.params;
    //calcular fecha inicio, segun fecha proceso
    //strFechaIni = obtenerFechaInicialAnual(fecha_proceso);

    //console.log(strFechaIni);
    strSQL = "SELECT mve_venta_detalle.zona_entrega";
    strSQL = strSQL + " ,cast(mve_venta_detalle.comprobante_original_fecemi as varchar)::varchar(50) as comprobante_original_fecemi";
    strSQL = strSQL + " ,(mve_venta_detalle.comprobante_original_codigo";
    strSQL = strSQL + "   || '-' || mve_venta_detalle.comprobante_original_serie";
    strSQL = strSQL + "   || '-' || mve_venta_detalle.comprobante_original_numero";
    strSQL = strSQL + "   || '-' || mve_venta_detalle.item)::varchar(50) as pedido";
    strSQL = strSQL + " ,mve_venta.vendedor";
    strSQL = strSQL + " ,mve_venta.razon_social"; //mostramos cliente
    strSQL = strSQL + " ,mve_venta_detalle.descripcion";
    strSQL = strSQL + " ,mve_venta_detalle.comprobante_original_codigo";
    strSQL = strSQL + " ,mve_venta_detalle.comprobante_original_serie";
    strSQL = strSQL + " ,mve_venta_detalle.comprobante_original_numero";
    strSQL = strSQL + " ,mve_venta_detalle.elemento";
    strSQL = strSQL + " ,mve_venta_detalle.item";
    strSQL = strSQL + " ,substr(cast(mve_venta_detalle.fecha_entrega as varchar),1,16)::varchar(50) as fecha_entrega";
    strSQL = strSQL + " ,mve_venta_detalle.tr_ruc";
    strSQL = strSQL + " ,mve_venta_detalle.tr_razon_social";
    strSQL = strSQL + " ,mve_venta_detalle.tr_chofer";
    strSQL = strSQL + " ,mve_venta_detalle.tr_celular";
    strSQL = strSQL + " ,mve_venta_detalle.tr_placa";
    strSQL = strSQL + " ,cast(mve_venta_detalle.tr_fecha_carga as varchar)::varchar(20) as tr_fecha_carga";
    strSQL = strSQL + " ,mve_venta_detalle.estado";
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mve_venta_detalle INNER JOIN mve_venta";
    strSQL = strSQL + " ON (mve_venta_detalle.id_empresa = mve_venta.id_empresa and ";
    strSQL = strSQL + "     mve_venta_detalle.ano = mve_venta.ano and ";
    strSQL = strSQL + "     mve_venta_detalle.comprobante_original_codigo = mve_venta.comprobante_original_codigo and ";
    strSQL = strSQL + "     mve_venta_detalle.comprobante_original_serie = mve_venta.comprobante_original_serie and ";
    strSQL = strSQL + "     mve_venta_detalle.comprobante_original_numero = mve_venta.comprobante_original_numero and ";
    strSQL = strSQL + "     mve_venta_detalle.elemento = mve_venta.elemento ) ";
    strSQL = strSQL + " WHERE mve_venta_detalle.comprobante_original_fecemi BETWEEN '" + fecha_ini + "' and '" + fecha_proceso + "'";
    strSQL = strSQL + " ORDER BY comprobante_original_fecemi DESC, mve_venta_detalle.ctrl_insercion DESC, mve_venta_detalle.ref_razon_social";

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

const obtenerVenta = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        let strSQL ;
        
        strSQL = "SELECT ";
        strSQL = strSQL + "  mve_venta.id_empresa";
        strSQL = strSQL + " ,mve_venta.id_punto_venta";
        strSQL = strSQL + " ,mve_venta.tipo_op";
        strSQL = strSQL + " ,mve_venta.id_zona_venta";
        strSQL = strSQL + " ,mve_venta.zona_venta";
        strSQL = strSQL + " ,mve_venta.id_vendedor";
        strSQL = strSQL + " ,mve_venta.vendedor";
        strSQL = strSQL + " ,mve_venta.comprobante_original_codigo";
        strSQL = strSQL + " ,mve_venta.comprobante_original_serie";
        strSQL = strSQL + " ,mve_venta.comprobante_original_numero";
        strSQL = strSQL + " ,mve_venta.elemento";
        strSQL = strSQL + " ,cast(mve_venta.comprobante_original_fecemi as varchar)::varchar(50) as comprobante_original_fecemi";
        strSQL = strSQL + " ,mve_venta.documento_id";
        strSQL = strSQL + " ,mve_venta.razon_social";
        strSQL = strSQL + " ,mad_correntistas.codigo"; 
        strSQL = strSQL + " ,mve_venta.debe";
        strSQL = strSQL + " ,mve_venta.peso_total";
        strSQL = strSQL + " ,mve_venta.registrado";
        strSQL = strSQL + " ,mve_venta.id_formapago";   //new
        strSQL = strSQL + " ,mve_venta.formapago";      //new
        strSQL = strSQL + " ,mve_venta.cond_venta";     //new
        strSQL = strSQL + " ,mve_venta.cond_entrega";   //new
        strSQL = strSQL + " FROM mve_venta LEFT JOIN mad_correntistas";
        strSQL = strSQL + " ON (mve_venta.documento_id = mad_correntistas.documento_id) ";
        
        strSQL = strSQL + " WHERE mve_venta.comprobante_original_codigo = $1";
        strSQL = strSQL + " AND mve_venta.comprobante_original_serie = $2";
        strSQL = strSQL + " AND mve_venta.comprobante_original_numero = $3";
        strSQL = strSQL + " AND mve_venta.elemento = $4";
        //console.log(strSQL);

        const result = await pool.query(strSQL,[cod,serie,num,elem]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearVenta = async (req,res,next)=> {
    let strSQL;
    var nPos;
    var sCod;
    var sSerie;
    const {
        id_empresa,     //1
        id_punto_venta, //2
        tipo_op,        //3
        id_zona_venta,  //4
        zona_venta,     //5
        id_vendedor,    //6
        vendedor,       //7
        comprobante_original_fecemi, //8
        documento_id,   //9
        razon_social,   //10
        debe,           //11
        peso_total,     //12
        registrado,     //13
        id_formapago,   //14 new
        formapago,      //15 new
        cond_venta,     //16 new
        cond_entrega    //17 new
        } = req.body
    //COD = Procesar zona_venta, para extraer siglas (LCH-LIMA) => LCH
    //SERIE = Procesar comprobante_original_fecemi, para extraer mes (28/10/2022) => 10
    nPos = zona_venta.indexOf('-');
    sCod = zona_venta.substr(0,nPos);

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    /*
    let datePieces = comprobante_original_fecemi.split("/");
    const fechaArmada = new Date(datePieces[2],datePieces[1],datePieces[0]); //ok con hora 00:00:00
    sSerie = (fechaArmada.getMonth()+1).toString(); // ok, se aumenta +1, por pinche regla js
    sSerie = sSerie.padStart(2,'0');
    */
   
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    let datePieces = comprobante_original_fecemi.split("-");
    const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00
    //console.log(datePieces);
    //console.log("getMonth(): ",fechaArmada.getMonth());

    //sSerie = (fechaArmada.getMonth()+1).toString(); // ok, se aumenta +1, por pinche regla js
    sSerie = (fechaArmada.getMonth()).toString(); // ok, pero para este caso no necesita
    sSerie = sSerie.padStart(2,'0');
    let sAno = (fechaArmada.getFullYear()).toString(); // new 

    /*
    const fecha = new Date(); //ok fecha y hora actual
    sSerie = fecha.getMonth(); // ok, se aumenta +1, por pinche regla js
    //const fecha = new Date("2022-10-29"); //ok con hora 00:00:00
    console.log(sSerie); */

    strSQL = "INSERT INTO mve_venta";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
    strSQL = strSQL + " ,ano"; //new
    strSQL = strSQL + " ,id_punto_venta";
    strSQL = strSQL + " ,tipo_op";
    strSQL = strSQL + " ,id_zona_venta";
    strSQL = strSQL + " ,zona_venta";
    strSQL = strSQL + " ,id_vendedor";
    strSQL = strSQL + " ,vendedor";
    strSQL = strSQL + " ,comprobante_original_codigo";
    strSQL = strSQL + " ,comprobante_original_serie";
    strSQL = strSQL + " ,comprobante_original_numero";
    strSQL = strSQL + " ,elemento";
    strSQL = strSQL + " ,comprobante_original_fecemi";
    strSQL = strSQL + " ,comprobante_original_fecpagovct";
    strSQL = strSQL + " ,documento_id";
    strSQL = strSQL + " ,razon_social";
    strSQL = strSQL + " ,debe";
    strSQL = strSQL + " ,peso_total";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " ,id_formapago";     //new
    strSQL = strSQL + " ,formapago";        //new
    strSQL = strSQL + " ,cond_venta";       //new
    strSQL = strSQL + " ,cond_entrega";     //new
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,'" + sAno + "'";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,'" + sCod + "'";
    strSQL = strSQL + " ,'" + sSerie + "'";
    strSQL = strSQL + " ,(select * from fve_genera_venta_sf(1,'" + sCod + "','" + sSerie + "'))";
    strSQL = strSQL + ",1"; //elemento
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,$13";
    strSQL = strSQL + " ,$14";  //new
    strSQL = strSQL + " ,$15";  //new
    strSQL = strSQL + " ,$16";  //new
    strSQL = strSQL + " ,$17";  //new
    strSQL = strSQL + " ) RETURNING *";
    try {
        //console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,     //1
            id_punto_venta, //2
            tipo_op,        //3
            id_zona_venta,  //4
            zona_venta,     //5
            id_vendedor,    //6
            vendedor,       //7
            comprobante_original_fecemi, //8
            documento_id,   //9
            razon_social,   //10
            debe,           //11
            peso_total,     //12
            registrado,     //13
            id_formapago,   //14 new
            formapago,      //15 new
            cond_venta,     //16 new
            cond_entrega    //17 new
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarVenta = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        var strSQL;
        var result;
        var result2;

        strSQL = "DELETE FROM mve_venta_detalle ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        result = await pool.query(strSQL,[cod,serie,num,elem]);
        /*if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle no encontrado"
            });
*/
        strSQL = "DELETE FROM mve_venta ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        result2 = await pool.query(strSQL,[cod,serie,num,elem]);
        /*if (result2.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });
*/
        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarVenta = async (req,res,next)=> {
    try {
        const { vendedor,       //01
                id_vendedor,    //02
                documento_id,   //03
                razon_social,   //04
                id_formapago,   //05
                formapago,      //06
                cond_venta,     //07
                cond_entrega    //08
            } = req.body

        const {cod,serie,num,elem} = req.params;
        
        var strSQL;
        strSQL = "UPDATE mve_venta SET ";
        strSQL = strSQL + "  id_vendedor = $1";
        strSQL = strSQL + " ,vendedor = $2";
        strSQL = strSQL + " ,documento_id = $3";
        strSQL = strSQL + " ,razon_social = $4";
        
        strSQL = strSQL + " ,id_formapago = $5";    //new
        strSQL = strSQL + " ,formapago = $6";       //new
        strSQL = strSQL + " ,cond_venta = $7";      //new
        strSQL = strSQL + " ,cond_entrega = $8";    //new

        strSQL = strSQL + " WHERE comprobante_original_codigo = $9";
        strSQL = strSQL + " AND comprobante_original_serie = $10";
        strSQL = strSQL + " AND comprobante_original_numero = $11";
        strSQL = strSQL + " AND elemento = $12";
 
        const result = await pool.query(strSQL,
        [   
            id_vendedor,    //01 body
            vendedor,       //02 body
            documento_id,   //03 body
            razon_social,   //04 body
            id_formapago,   //05 body
            formapago,      //06 body
            cond_venta,     //07 body
            cond_entrega,   //08 body

            cod,            //09 param
            serie,          //10 param
            num,            //11 param
            elem            //12 param
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodasVentas,
    obtenerTodasVentasPlan,
    obtenerVenta,
    crearVenta,
    eliminarVenta,
    actualizarVenta
 }; 