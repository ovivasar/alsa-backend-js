const pool = require('../db');

const obtenerTodasOCargas = async (req,res,next)=> {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    let strFechaIni;
    const {fecha_proceso} = req.params;
    //calcular fecha inicio, segun fecha proceso
    //strFechaIni = obtenerFechaInicial(fecha_proceso);
    strFechaIni = obtenerFechaInicialAnual(fecha_proceso);

    //console.log(strFechaIni);
    strSQL = "SELECT cast(fecha as varchar)::varchar(50) as fecha";
    strSQL = strSQL + " ,(ref_cod || '-' || ref_serie || '-' || ref_numero)::varchar(50) as pedido";    
    strSQL = strSQL + " ,numero";
    strSQL = strSQL + " ,ref_razon_social";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " ,estado"; //new
    strSQL = strSQL + " ,'0'::varchar(1) tb"; //new
    strSQL = strSQL + " ,cast(date_part('year',fecha) as varchar) as ano";
    
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mst_ocarga_detalle ";
    strSQL = strSQL + " WHERE fecha BETWEEN '" + strFechaIni + "' and '" + fecha_proceso + "'";
    strSQL = strSQL + " GROUP BY fecha,ref_cod,ref_serie,ref_numero,numero,ref_razon_social,registrado,estado,ano";
    strSQL = strSQL + " ORDER BY fecha DESC, numero DESC";

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

const obtenerTodasOCargasPlan = async (req,res,next)=> {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    let strFechaIni;
    const {fecha_ini,fecha_proceso,tipo} = req.params;
    //calcular fecha inicio, segun fecha proceso
    //strFechaIni = obtenerFechaInicial(fecha_proceso);
    //strFechaIni = obtenerFechaInicialAnual(fecha_proceso);

    //console.log(strFechaIni);
    strSQL = "SELECT cast(mst_ocarga_detalle.fecha as varchar)::varchar(50) as fecha";
    strSQL = strSQL + " ,coalesce((mst_ocarga_detalle.ref_cod || '-' || mst_ocarga_detalle.ref_serie || '-' || mst_ocarga_detalle.ref_numero),'-')::varchar(50) as pedido";    
    strSQL = strSQL + " ,mst_ocarga_detalle.zona_entrega"; //usar coalesce(prioridad,secundario)
    strSQL = strSQL + " ,mst_ocarga_detalle.numero";
    strSQL = strSQL + " ,mst_ocarga_detalle.estado"; 
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.ref_documento_id,'-')::varchar(20) as ref_documento_id"; //info cliente
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.ref_razon_social,'-')::varchar(200) as ref_razon_social"; //info cliente
    
    strSQL = strSQL + " ,coalesce(mve_venta_detalle.ref_documento_id,'-')::varchar(20) as fact_documento_id"; //fact
    strSQL = strSQL + " ,coalesce(mve_venta_detalle.ref_razon_social,'-')::varchar(200) as fact_razon_social"; //fact
    strSQL = strSQL + " ,mad_correntistas.codigo";
    strSQL = strSQL + " ,mve_venta.zona_venta";
    strSQL = strSQL + " ,mve_venta.vendedor";
    strSQL = strSQL +"  ,cast(mve_venta.comprobante_original_fecemi as varchar)::varchar(50) as fecha_venta"; //new
    strSQL = strSQL + " ,coalesce(mve_venta_detalle.precio_unitario,0)::numeric(14,2) as precio_unitario";    //new
    strSQL = strSQL + " ,mve_venta_detalle.moneda";             //new
    strSQL = strSQL + " ,coalesce(mve_venta_detalle.porc_igv,0)::numeric(5) as porc_igv";           //new

    strSQL = strSQL + " ,mst_ocarga_detalle.item";
    strSQL = strSQL + " ,mst_ocarga_detalle.cantidad";      
    strSQL = strSQL + " ,mst_ocarga_detalle.unidad_medida"; 
    strSQL = strSQL + " ,mst_ocarga_detalle.descripcion";
    strSQL = strSQL + " ,mst_ocarga_detalle.operacion";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.sacos_real,0)::numeric(14,2) as sacos_real";    
    strSQL = strSQL + " ,mst_ocarga_detalle.lote_asignado";
    strSQL = strSQL + " ,mst_ocarga_detalle.lote_procedencia";
    strSQL = strSQL + " ,mst_ocarga_detalle.ticket";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.peso_ticket,0)::numeric(14,2) as peso_ticket";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.sacos_ticket,0)::numeric(14,2) as sacos_ticket";
    strSQL = strSQL + " ,mst_ocarga_detalle.ticket_tras"; //no sirve
    strSQL = strSQL + " ,mst_ocarga_detalle.peso_ticket_tras";//no sirve
    strSQL = strSQL + " ,mst_ocarga_detalle.sacos_ticket_tras";//no sirve
    
    strSQL = strSQL + " ,mst_ocarga_detalle.guia01";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_peso01,0)::numeric(14,2) as e_peso01";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_monto01,0)::numeric(14,2) as e_monto01";
    strSQL = strSQL + " ,mst_ocarga_detalle.guia02";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_peso02,0)::numeric(14,2) as e_peso02";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_monto02,0)::numeric(14,2) as e_monto02";
    strSQL = strSQL + " ,mst_ocarga_detalle.guia03";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_peso03,0)::numeric(14,2) as e_peso03";
    strSQL = strSQL + " ,coalesce(mst_ocarga_detalle.e_monto03,0)::numeric(14,2) as e_monto03";

    strSQL = strSQL + " ,mst_ocarga_detalle.e_razon_social";
    strSQL = strSQL + " ,mst_ocarga_detalle.e_rh";
    strSQL = strSQL + " ,mst_ocarga_detalle.e_hora_ini";
    strSQL = strSQL + " ,mst_ocarga_detalle.e_hora_fin";
    strSQL = strSQL + " ,mst_ocarga_detalle.e_estibadores";
    strSQL = strSQL + " ,mst_ocarga_detalle.e_observacion";
    strSQL = strSQL + " ,mst_ocarga_detalle.registrado";
    strSQL = strSQL + " ,'0'::varchar(1) tb"; 
    strSQL = strSQL + " ,mst_ocarga_detalle.tipo"; 
    strSQL = strSQL + " ,TO_CHAR(EXTRACT(MONTH FROM fecha), 'FM00') AS mes"; //new
    strSQL = strSQL + " ,cast(date_part('year',mst_ocarga_detalle.fecha) as varchar) as ano";
    
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " (";
    strSQL = strSQL + " (";
    strSQL = strSQL + " mst_ocarga_detalle LEFT JOIN mve_venta_detalle";
    strSQL = strSQL + " ON (mst_ocarga_detalle.id_empresa = mve_venta_detalle.id_empresa and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_cod = mve_venta_detalle.comprobante_original_codigo and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_serie = mve_venta_detalle.comprobante_original_serie and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_numero = mve_venta_detalle.comprobante_original_numero and";
    strSQL = strSQL + "     1 = mve_venta_detalle.elemento and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_item = mve_venta_detalle.item)";
    strSQL = strSQL + " ) LEFT JOIN mad_correntistas";
    strSQL = strSQL + " ON (mst_ocarga_detalle.ref_documento_id =  mad_correntistas.documento_id) ";
    strSQL = strSQL + " ) LEFT JOIN mve_venta";
    strSQL = strSQL + " ON (mst_ocarga_detalle.id_empresa = mve_venta.id_empresa and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_cod = mve_venta.comprobante_original_codigo and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_serie = mve_venta.comprobante_original_serie and";
    strSQL = strSQL + "     mst_ocarga_detalle.ref_numero = mve_venta.comprobante_original_numero and";
    strSQL = strSQL + "     1 = mve_venta.elemento )";

    strSQL = strSQL + " WHERE mst_ocarga_detalle.fecha BETWEEN '" + fecha_ini + "' and '" + fecha_proceso + "'";
    if (tipo==="P"){
        strSQL = strSQL + " AND mst_ocarga_detalle.tipo = 'P'";
    }
    else{//En caso sea ejecucion: Todos Programados sin ejecutar + Todos los ejecutados
        strSQL = strSQL + " AND mst_ocarga_detalle.tipo = 'E'";
        strSQL = strSQL + " OR (mst_ocarga_detalle.tipo = 'P' and mst_ocarga_detalle.ejecuta is null)";
    }
    
    strSQL = strSQL + " ORDER BY fecha DESC, numero DESC, item DESC";

    try {
        console.log(strSQL);
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};
function obtenerMesesEntreFechas(fecha1, fecha2) {
  // Extrae el año y mes de fecha1
  const [anio1, mes1] = fecha1.split('-');

  // Extrae el año y mes de fecha2
  const [anio2, mes2] = fecha2.split('-');

  // Convierte los años y meses en números
  const anioInicio = parseInt(anio1, 10);
  const anioFin = parseInt(anio2, 10);
  const mesInicio = parseInt(mes1, 10);
  const mesFin = parseInt(mes2, 10);

  // Arreglo para almacenar los meses
  const meses = [];

  // Itera desde el año y mes de inicio hasta el año y mes de fin
  for (let anio = anioInicio; anio <= anioFin; anio++) {
    // El mes inicial depende del año actual
    let mesInicioActual = mesInicio;
    if (anio === anioInicio) {
      mesInicioActual = Math.max(mesInicioActual, 1);
    }
    // El mes final depende del año actual
    let mesFinActual = mesFin;
    if (anio === anioFin) {
      mesFinActual = Math.min(mesFinActual, 12);
    }

    // Itera sobre los meses del año actual
    for (let mes = mesInicioActual; mes <= mesFinActual; mes++) {
      // Formatea el mes con dos dígitos (por ejemplo, '05' en lugar de '5')
      const mesFormateado = mes.toString().padStart(2, '0');

      // Construye el formato 'YYYY-MM' y lo agrega al arreglo de meses
      meses.push(`${anio}-${mesFormateado}`);
    }
  }
  return meses;
}

const obtenerTodasOCargasPlanCrossTab = async (req, res, next) => {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    const { fecha_ini, fecha_proceso } = req.params;

    // Utiliza la función para obtener los meses entre las fechas
    const meses = obtenerMesesEntreFechas(fecha_ini, fecha_proceso);

    strSQL = "SELECT ";
    strSQL = strSQL + " ref_razon_social";

    // Agrega los meses dinámicamente en la consulta
    meses.forEach((mes) => {
        strSQL = strSQL + ` ,"${mes}"`;
    });
    // Agrega la suma de meses dinámicamente en la consulta
    strSQL = strSQL + ` ,(`;
    meses.forEach((mes) => {
        strSQL = strSQL + ` +coalesce("${mes}",0)`;
    });
    strSQL = strSQL + ` ) as total_cli`;

    strSQL = strSQL + " FROM crosstab(";
    strSQL = strSQL + " 'SELECT ref_razon_social, TO_CHAR(fecha, ''YYYY-MM'') AS mes, count(cantidad) AS cantidad";
    strSQL = strSQL + " FROM mst_ocarga_detalle";
    strSQL = strSQL + " WHERE fecha BETWEEN ''" + fecha_ini + "'' and ''" + fecha_proceso + "''";
    strSQL = strSQL + " AND mst_ocarga_detalle.tipo = ''E''";
    strSQL = strSQL + " AND (NOT mst_ocarga_detalle.ref_cod is null)"; //Filtrar solo ventas
    strSQL = strSQL + " GROUP BY mes, ref_razon_social";
    strSQL = strSQL + " ORDER BY ref_razon_social',";

    // Agrega los valores de los meses dinámicamente
    strSQL = strSQL + " $$VALUES " + meses.map((mes) => `('${mes}')`).join(', ') + "$$";
    strSQL = strSQL + " ) AS ct (ref_razon_social text";

    // Agrega las columnas de meses dinámicamente
    meses.forEach((mes) => {
        strSQL = strSQL + `, "${mes}" numeric`;
    });

    strSQL = strSQL + " );";

    try {
        console.log(strSQL);
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    } catch (error) {
        console.log(error.message);
    }
};
const obtenerTodasOCargasPlanCrossTab2 = async (req, res, next) => {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    const { fecha_ini, fecha_proceso } = req.params;

    // Utiliza la función para obtener los meses entre las fechas
    const meses = obtenerMesesEntreFechas(fecha_ini, fecha_proceso);

    strSQL = "SELECT descripcion";
    strSQL = strSQL + " ,ref_razon_social";

    // Agrega los meses dinámicamente en la consulta
    meses.forEach((mes) => {
        strSQL = strSQL + ` ,"${mes}"`;
    });

    strSQL = strSQL + " FROM crosstab(";
    strSQL = strSQL + " 'SELECT ref_razon_social, TO_CHAR(fecha, ''YYYY-MM'') AS mes, count(cantidad) AS cantidad";
    strSQL = strSQL + " FROM mst_ocarga_detalle";
    strSQL = strSQL + " WHERE fecha BETWEEN ''" + fecha_ini + "'' and ''" + fecha_proceso + "''";
    strSQL = strSQL + " AND mst_ocarga_detalle.tipo = ''E''";
    strSQL = strSQL + " AND (NOT mst_ocarga_detalle.ref_cod is null)"; //Filtrar solo ventas
    strSQL = strSQL + " GROUP BY mes, ref_razon_social";
    strSQL = strSQL + " ORDER BY ref_razon_social',";

    // Agrega los valores de los meses dinámicamente
    strSQL = strSQL + " $$VALUES " + meses.map((mes) => `('${mes}')`).join(', ') + "$$";
    strSQL = strSQL + " ) AS ct (ref_razon_social text";

    // Agrega las columnas de meses dinámicamente
    meses.forEach((mes) => {
        strSQL = strSQL + `, "${mes}" numeric`;
    });

    strSQL = strSQL + " );";

    try {
        console.log(strSQL);
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    } catch (error) {
        console.log(error.message);
    }
};

const obtenerTodasOCargasPlanTransb = async (req,res,next)=> {
    //Version analizado, similar formato excel manejado en administracion
    let strSQL;
    const {fecha_proceso} = req.params;
    //calcular fecha inicio, segun fecha proceso
    //strFechaIni = obtenerFechaInicial(fecha_proceso);
    //strFechaIni = obtenerFechaInicialAnual(fecha_proceso);

    //console.log(strFechaIni);
    strSQL = "SELECT cast(fecha as varchar)::varchar(50) as fecha";
    strSQL = strSQL + " ,(ref_cod || '-' || ref_serie || '-' || ref_numero)::varchar(50) as pedido";    
    strSQL = strSQL + " ,zona_entrega"; //usar coalesce(prioridad,secundario)
    strSQL = strSQL + " ,numero";
    strSQL = strSQL + " ,estado"; //new
    strSQL = strSQL + " ,ref_razon_social";
    strSQL = strSQL + " ,item";
    strSQL = strSQL + " ,cantidad";     //new
    strSQL = strSQL + " ,unidad_medida";     //new
    strSQL = strSQL + " ,descripcion";
    strSQL = strSQL + " ,operacion";
    strSQL = strSQL + " ,sacos_real";   //new
    strSQL = strSQL + " ,lote_asignado";
    strSQL = strSQL + " ,lote_procedencia";
    strSQL = strSQL + " ,ticket";
    strSQL = strSQL + " ,peso_ticket";
    strSQL = strSQL + " ,sacos_ticket";
    strSQL = strSQL + " ,ticket_tras";
    strSQL = strSQL + " ,peso_ticket_tras";
    strSQL = strSQL + " ,sacos_ticket_tras";
    strSQL = strSQL + " ,guia01";
    strSQL = strSQL + " ,e_peso01";
    strSQL = strSQL + " ,e_monto01";
    strSQL = strSQL + " ,e_razon_social";
    strSQL = strSQL + " ,e_rh";
    strSQL = strSQL + " ,e_hora_ini";
    strSQL = strSQL + " ,e_hora_fin";
    strSQL = strSQL + " ,e_estibadores";
    strSQL = strSQL + " ,e_observacion";
    strSQL = strSQL + " ,registrado";
    strSQL = strSQL + " ,'1'::varchar(1) tb"; //new
    strSQL = strSQL + " ,cast(date_part('year',fecha) as varchar) as ano";
    
    strSQL = strSQL + " FROM";
    strSQL = strSQL + " mst_ocarga_detalle ";
    strSQL = strSQL + " WHERE fecha BETWEEN '" + fecha_proceso + "' and '" + fecha_proceso + "'";
    strSQL = strSQL + " AND operacion like 'TRANSBORDO'";
    strSQL = strSQL + " ORDER BY fecha DESC, numero DESC, item DESC";

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
        let strSQL;
        
        strSQL = "SELECT ";
        strSQL = strSQL + " cast(fecha as varchar)::varchar(50) as fecha";
        strSQL = strSQL + " ,numero";
        strSQL = strSQL + " ,ticket";
        strSQL = strSQL + " ,ref_razon_social"; //necesario para impresion
        strSQL = strSQL + " ,peso_ticket";
        strSQL = strSQL + " ,sacos_ticket";
        strSQL = strSQL + " ,estado";
        strSQL = strSQL + " FROM mst_ocarga_detalle";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        strSQL = strSQL + " GROUP BY fecha,numero,ticket,ref_razon_social,peso_ticket,sacos_ticket,estado";
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
    obtenerTodasOCargasPlanCrossTab,
    obtenerTodasOCargasPlanCrossTab2,
    obtenerTodasOCargasPlanTransb,
    obtenerOCarga,
    crearOCarga,
    eliminarOCarga,
    actualizarOCarga
 }; 