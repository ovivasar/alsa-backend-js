const pool = require('../db');

const obtenerTodasOCargasDet = async (req,res,next)=> {
    let strSQL;
    const {ano,numero,tipo} = req.params;
    
    //console.log(ano,numero,tipo);
    strSQL = "SELECT ";
    strSQL = strSQL + "  mst_ocarga_detalle.*";
    strSQL = strSQL + " ,cast(mst_ocarga_detalle.fecha as varchar)::varchar(50) as fecha2";
    strSQL = strSQL + " ,(mst_ocarga_detalle.ref_cod || '-' || mst_ocarga_detalle.ref_serie || '-' || mst_ocarga_detalle.ref_numero)::varchar(100) as pedido ";

    strSQL = strSQL + " FROM mst_ocarga_detalle";
    strSQL = strSQL + " WHERE ano = $1";
    strSQL = strSQL + " AND numero = $2";
    strSQL = strSQL + " AND tipo = $3";
    strSQL = strSQL + " ORDER BY item";
    //console.log(strSQL);
    try {
        const todosReg = await pool.query(strSQL,[ano,numero,tipo]);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }

    //res.send('Listado de todas los zonas');
};

const obtenerOCargaDet = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        let strSQL ;
        console.log(ano,numero,item);
        strSQL = "SELECT ";
        strSQL = strSQL + "  mst_ocarga_detalle.*";
        strSQL = strSQL + " ,cast(mst_ocarga_detalle.fecha as varchar)::varchar(50) as fecha2";
        strSQL = strSQL + " ,(mst_ocarga_detalle.ref_cod || '-' || mst_ocarga_detalle.ref_serie || '-' || mst_ocarga_detalle.ref_numero || '-' || mst_ocarga_detalle.ref_item)::varchar(100) as pedido ";
        strSQL = strSQL + " FROM mst_ocarga_detalle";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        strSQL = strSQL + " AND item = $3";
        console.log(strSQL);
        const result = await pool.query(strSQL,[ano,numero,item]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Orden de Carga no encontrada"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearOCargaDet = async (req,res,next)=> {
    let strSQL;
    var sAno;
    const {
        id_empresa,      //1
        id_punto_venta,  //2
        fecha2,          //3
        //ano: calculado de la fecha
        //numero,        //
        //item: calculado funcion postgres
        ref_documento_id,   //4
        ref_razon_social,   //5
        id_producto,        //6
        descripcion,        //7
        cantidad,           //8
        operacion,          //9 ocarga-fase01
        tr_placa,           //10
        tr_placacargado,    //11 ocarga-fase01
        id_zona_entrega,    //12 ventas referencial, no visible
        zona_entrega,       //13 ventas referencial, no visible
        registrado,         //14
        unidad_medida,      //15 ventas referencial
        tipo,               //16 'P' o 'E'
        pedido              //
        } = req.body

    const idZonaEntrega = id_zona_entrega === "" ? null : id_zona_entrega;
    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    //console.log(fecha2);
    let datePieces = fecha2.split("-");
    //console.log(datePieces);
    const fechaArmada = new Date(datePieces[0],(datePieces[1]-1),datePieces[2]); //ok con hora 00:00:00
    //console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    //console.log(sAno);

    var sRefCod="";
    var sRefSerie="";
    var sRefNumero="";
    var sRefItem="";

    if ("pedido" in req.body) {
        if (pedido!=""){
            let pedidoPieces = pedido.split("-");
            sRefCod=pedidoPieces[0];
            sRefSerie=pedidoPieces[1];
            sRefNumero=pedidoPieces[2];
            sRefItem=pedidoPieces[3];
        }
    }

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";       //1
    strSQL = strSQL + " ,id_punto_venta";   //2
    strSQL = strSQL + " ,fecha";            //3
    strSQL = strSQL + " ,ano";      //calculado de fecha
    strSQL = strSQL + " ,numero";   //funcion postgres
    strSQL = strSQL + " ,item";     //funcion postgres

    strSQL = strSQL + " ,ref_cod";      //ref pedido 3 columnas
    strSQL = strSQL + " ,ref_serie";    //ref pedido 3 columnas
    strSQL = strSQL + " ,ref_numero";   //ref pedido 3 columnas
    strSQL = strSQL + " ,ref_item";     //ref pedido 3 columnas
    
    strSQL = strSQL + " ,ref_documento_id";     //4
    strSQL = strSQL + " ,ref_razon_social";     //5
    strSQL = strSQL + " ,id_producto";          //6
    strSQL = strSQL + " ,descripcion";          //7
    strSQL = strSQL + " ,cantidad";             //8
    strSQL = strSQL + " ,operacion";            //9
    strSQL = strSQL + " ,tr_placa";             //10
    strSQL = strSQL + " ,tr_placacargado";      //11
    strSQL = strSQL + " ,id_zona_entrega";      //12
    strSQL = strSQL + " ,zona_entrega";         //13
    strSQL = strSQL + " ,registrado";           //14

    strSQL = strSQL + " ,unidad_medida";        //15 neww
    strSQL = strSQL + " ,ctrl_insercion";       // current
    strSQL = strSQL + " ,estado";               // 'PENDIENTE'
    strSQL = strSQL + " ,e_estibadores";        // '-'
    strSQL = strSQL + " ,tipo";                 //16 neww
    
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,'" + sAno + "'";
    
    strSQL = strSQL + " ,(select * from fst_genera_ocarga($1,'" + sAno + "'))";
    strSQL = strSQL + " ,1"; //item = 1 por default
    //cuidado 2 modos: 
    //1ero: parametros fecha, item = 1 
    //2do: parametros ano, numero, item = genera
    strSQL = strSQL + " ,'" + sRefCod + "'";
    strSQL = strSQL + " ,'" + sRefSerie + "'";
    strSQL = strSQL + " ,'" + sRefNumero + "'";
    if (typeof sRefItem === "number") {
        strSQL = strSQL + " ,'" + sRefItem + "'";
    }else{
        if (sRefItem != null) {
            strSQL = strSQL + " ,'" + sRefItem + "'";
        }else {
            strSQL = strSQL + " ,null";
        }
    }

    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,$13";
    strSQL = strSQL + " ,$14";
    strSQL = strSQL + " ,$15"; //new unidad_medida
    strSQL = strSQL + " ,current_timestamp"; //ctrl_insercion
    strSQL = strSQL + " ,'PENDIENTE'";      //estado NEW
    strSQL = strSQL + " ,'-'";              //NEW estibadores, para no dejar en null al filtro principal
    strSQL = strSQL + " ,$16"; //new tipo

    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,      //1
            id_punto_venta,  //2
            fecha2,          //3
            //ano: calculado de la fecha
            //numero,        //
            //item: calculado funcion postgres
            ref_documento_id,   //4
            ref_razon_social,   //5
            id_producto,        //6
            descripcion,        //7
            cantidad,           //8
            operacion,          //9
            tr_placa,           //10
            tr_placacargado,    //11
            idZonaEntrega,      //12 cambiooooo
            zona_entrega,       //13
            registrado,         //14
            unidad_medida,      //15
            tipo                //16 new
            ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const agregarOCargaDet = async (req,res,next)=> {
    let strSQL;
    var sAno;
    const {
        id_empresa,     //1
        id_punto_venta, //2
        fecha2,         //3
        //ano: calculado de la fecha
        numero,         //4
        //item: calculado funcion postgres
        ref_documento_id,   //5
        ref_razon_social,   //6
        id_producto,        //7
        descripcion,        //8
        cantidad,           //9
        operacion,          //10 ocarga-fase01
        tr_placa,           //11
        tr_placacargado,    //12 ocarga-fase01
        id_zona_entrega,    //13 ventas referencial, no visible
        zona_entrega,       //14 ventas referencial, no visible
        registrado,         //15
        unidad_medida,      //16
        tipo,               //17  NEW  P=Programacion  E=Ejecucion
        pedido              //
        } = req.body

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    console.log(fecha2);
    let datePieces = fecha2.split("-");
    const fechaArmada = new Date(datePieces[0],(datePieces[1]-1),datePieces[2]); //ok con hora 00:00:00
    //console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    //console.log(sAno); 

    var sRefCod="";
    var sRefSerie="";
    var sRefNumero="";
    var sRefItem="";
    if ("pedido" in req.body) {
        let pedidoPieces = pedido.split("-");
        sRefCod=pedidoPieces[0];
        sRefSerie=pedidoPieces[1];
        sRefNumero=pedidoPieces[2];
        sRefItem=pedidoPieces[3];
    }

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";       //1
    strSQL = strSQL + " ,id_punto_venta";   //2
    strSQL = strSQL + " ,fecha";            //3
    strSQL = strSQL + " ,ano";          //calculado de fecha
    strSQL = strSQL + " ,numero";           //4 NEWWW
    strSQL = strSQL + " ,item";         //calculado funcion postgres
    ///////////////////////////////////////////////////
    strSQL = strSQL + " ,ref_cod";      //ref pedido 4 col
    strSQL = strSQL + " ,ref_serie";    //ref pedido 4 col
    strSQL = strSQL + " ,ref_numero";   //ref pedido 4 col
    strSQL = strSQL + " ,ref_item";     //ref pedido 4 col
    ////////////////////////////////////////////////////
    strSQL = strSQL + " ,ref_documento_id";     //5
    strSQL = strSQL + " ,ref_razon_social";     //6
    strSQL = strSQL + " ,id_producto";          //7
    strSQL = strSQL + " ,descripcion";          //8
    strSQL = strSQL + " ,cantidad";             //9
    strSQL = strSQL + " ,operacion";            //10
    strSQL = strSQL + " ,tr_placa";             //11
    strSQL = strSQL + " ,tr_placacargado";      //12
    strSQL = strSQL + " ,id_zona_entrega";      //13
    strSQL = strSQL + " ,zona_entrega";         //14
    strSQL = strSQL + " ,registrado";           //15
    strSQL = strSQL + " ,unidad_medida";           //16

    strSQL = strSQL + " ,ctrl_insercion";       //16
    strSQL = strSQL + " ,estado";       //17 new
    strSQL = strSQL + " ,e_estibadores";       //18 neww
    strSQL = strSQL + " ,tipo";       //19 neww
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,'" + sAno + "'";
    
    strSQL = strSQL + " ,$4"; //numero
    strSQL = strSQL + " ,(select * from fst_genera_ocarga_item($1,'" + sAno + "','" + numero + "'))";
    //cuidado 2 modos: 
    //1ero: parametros fecha, item = 1 
    //2do: parametros ano, numero, item = genera
    strSQL = strSQL + " ,'" + sRefCod + "'";
    strSQL = strSQL + " ,'" + sRefSerie + "'";
    strSQL = strSQL + " ,'" + sRefNumero + "'";
    if (typeof sRefItem === "number") {
        strSQL = strSQL + " ,'" + sRefItem + "'";
    }else{
        if (sRefItem != null) {
            strSQL = strSQL + " ,'" + sRefItem + "'";
        }else {
            strSQL = strSQL + " ,null";
        }
    }
    
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,$13"; //id_zona
    strSQL = strSQL + " ,$14";  //entrega
    strSQL = strSQL + " ,$15"; //registrado
    strSQL = strSQL + " ,$16"; //new unidad_medida
    strSQL = strSQL + " ,current_timestamp";
    strSQL = strSQL + " ,'PENDIENTE'";
    strSQL = strSQL + " ,'-'"; //new estibadores, para evitar el null en filtro principal
    strSQL = strSQL + " ,$17"; //new tipo

    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,      //1
            id_punto_venta,  //2
            fecha2,          //3
            //ano: calculado de la fecha
            numero,          //4
            //item: calculado funcion postgres
            ref_documento_id,   //5
            ref_razon_social,   //6
            id_producto,        //7
            descripcion,        //8
            cantidad,           //9
            operacion,          //10
            tr_placa,           //11
            tr_placacargado,    //12
            id_zona_entrega,    //13
            zona_entrega,       //14
            registrado,          //15
            unidad_medida,       //16
            tipo                 //17  NEWWW
            ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const agregarOCargaDetEjec = async (req,res,next)=> {
    let strSQL0;
    let strSQL;
    const {ano,numero,item} = req.body

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";       //1
    strSQL = strSQL + " ,id_punto_venta";   //2
    strSQL = strSQL + " ,fecha";            //3
    strSQL = strSQL + " ,ano";              //4
    strSQL = strSQL + " ,numero";           //5
    strSQL = strSQL + " ,item";             //calculado funcion postgres
    strSQL = strSQL + " ,ref_cod";      
    strSQL = strSQL + " ,ref_serie";    
    strSQL = strSQL + " ,ref_numero";   
    strSQL = strSQL + " ,ref_item";     
    strSQL = strSQL + " ,ref_documento_id";     //5
    strSQL = strSQL + " ,ref_razon_social";     //6
    strSQL = strSQL + " ,id_producto";          //7
    strSQL = strSQL + " ,descripcion";          //8
    strSQL = strSQL + " ,cantidad";             //9
    strSQL = strSQL + " ,operacion";            //10
    strSQL = strSQL + " ,tr_placa";             //11
    strSQL = strSQL + " ,tr_placacargado";      //12
    strSQL = strSQL + " ,id_zona_entrega";      //13
    strSQL = strSQL + " ,zona_entrega";         //14
    strSQL = strSQL + " ,registrado";           //15
    strSQL = strSQL + " ,unidad_medida";         //16
    strSQL = strSQL + " ,ctrl_insercion";       //16
    strSQL = strSQL + " ,estado";               //17 new
    strSQL = strSQL + " ,tipo";                  //19 neww
    strSQL = strSQL + " ,e_estibadores";                  //19 neww
    strSQL = strSQL + " )";
    
    strSQL = strSQL + " SELECT";
    strSQL = strSQL + "  id_empresa";       //1
    strSQL = strSQL + " ,id_punto_venta";   //2
    strSQL = strSQL + " ,fecha";            //3
    strSQL = strSQL + " ,ano";              //4
    strSQL = strSQL + " ,numero";           //5
    strSQL = strSQL + " ,(select * from fst_genera_ocarga_item(id_empresa,ano,numero))"; //item
    strSQL = strSQL + " ,ref_cod";      
    strSQL = strSQL + " ,ref_serie";    
    strSQL = strSQL + " ,ref_numero";   
    strSQL = strSQL + " ,ref_item";     
    strSQL = strSQL + " ,ref_documento_id";     //5
    strSQL = strSQL + " ,ref_razon_social";     //6
    strSQL = strSQL + " ,id_producto";          //7
    strSQL = strSQL + " ,descripcion";          //8
    strSQL = strSQL + " ,cantidad";             //9
    strSQL = strSQL + " ,operacion";            //10
    strSQL = strSQL + " ,tr_placa";             //11
    strSQL = strSQL + " ,tr_placacargado";      //12
    strSQL = strSQL + " ,id_zona_entrega";      //13
    strSQL = strSQL + " ,zona_entrega";         //14
    strSQL = strSQL + " ,registrado";           //15
    strSQL = strSQL + " ,unidad_medida";         //16
    strSQL = strSQL + " ,ctrl_insercion";       //16
    strSQL = strSQL + " ,estado";               //17 new
    strSQL = strSQL + " ,'E'";                  //tipo = 'E' Ejecucion
    strSQL = strSQL + " ,e_estibadores";        //19 neww
    strSQL = strSQL + " FROM mst_ocarga_detalle";
    strSQL = strSQL + " WHERE ano = $1";
    strSQL = strSQL + " AND numero = $2";
    strSQL = strSQL + " AND item = $3";
    strSQL = strSQL + " RETURNING *";

    strSQL0 = "UPDATE mst_ocarga_detalle SET ejecuta = '1'";
    strSQL0 = strSQL0 + " WHERE ano = $1";
    strSQL0 = strSQL0 + " AND numero = $2";
    strSQL0 = strSQL0 + " AND item = $3";

    try {
        //Actualizamos el programado, como ejecutado
        console.log(strSQL0);
        await pool.query(strSQL0,[ano,numero,item]);
        
        //Insertamos el ejecutado
        console.log(strSQL);
        const result = await pool.query(strSQL,[ano,numero,item]);
        
        res.json(result.rows[0]);
        //return res.sendStatus(204);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }


};

const eliminarOCargaDet = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        var strSQL;
        strSQL = "DELETE FROM mst_ocarga_detalle ";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        
        if (item!=null){
        strSQL = strSQL + " AND item = $3";
        const result = await pool.query(strSQL,[ano,numero,item]);
        }else{
        const result = await pool.query(strSQL,[ano,numero]);
        }

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle de Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};
const actualizarOCargaDet01 = async (req,res,next)=> {
    //Fase 01: Datos Operacion Carga/Descarga
    try {
        const {ano,numero,item} = req.params;
        const {
                operacion,      //1
                tr_placacargado,//2
                fecha2,          //3
                cantidad          //4
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  operacion = $1";
        strSQL = strSQL + " ,tr_placacargado = $2";
        strSQL = strSQL + " ,fecha = $3";
        strSQL = strSQL + " ,cantidad = $4";
        strSQL = strSQL + " ,ctrl_modifica = current_timestamp";

        strSQL = strSQL + " WHERE ano = $5";
        strSQL = strSQL + " AND numero = $6";
        strSQL = strSQL + " AND item = $7";

        const result = await pool.query(strSQL,
        [   
            operacion,       //1
            tr_placacargado, //2
            fecha2,          //3
            cantidad,          //4

            ano,            //5
            numero,         //6 
            item            //7
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const actualizarOCargaDet02 = async (req,res,next)=> {
    //Fase 02: Datos Almacen, Sacos, Lotes, Estibadores, Horas Ini FIn
    try {
        const {ano,numero,item} = req.params;
        const {
                sacos_real, 
                lote_procedencia,  
                lote_asignado, 
                e_estibadores, 
                e_hora_ini,
                e_hora_fin,
                e_observacion
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  sacos_real = $1";
        strSQL = strSQL + " ,lote_procedencia = $2";
        strSQL = strSQL + " ,lote_asignado = $3";
        strSQL = strSQL + " ,e_estibadores = $4";
        strSQL = strSQL + " ,e_hora_ini = $5";
        strSQL = strSQL + " ,e_hora_fin = $6";
        strSQL = strSQL + " ,e_observacion = $7";
        strSQL = strSQL + " ,ctrl_modifica02 = current_timestamp";

        strSQL = strSQL + " WHERE ano = $8";
        strSQL = strSQL + " AND numero = $9";
        strSQL = strSQL + " AND item = $10";

        const result = await pool.query(strSQL,
        [   
            sacos_real, 
            lote_procedencia,  
            lote_asignado, 
            e_estibadores, 
            e_hora_ini,
            e_hora_fin,
            e_observacion,
        
            ano,            //8
            numero,         //9
            item            //10
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const actualizarOCargaDet03 = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        const {
                ticket,         //1
                peso_ticket,    //2
                sacos_ticket,    //3

                guia01,           //4
                guia_traslado01,  //5
                guia_sacos01,     //6
                e_peso01,         //7
                e_monto01,         //8

                guia02,           //9
                guia_traslado02,  //10
                guia_sacos02,     //11
                e_peso02,         //12
                e_monto02,         //13

                guia03,           //14
                guia_traslado03,  //15
                guia_sacos03,     //16
                e_peso03,         //17
                e_monto03         //18
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  ticket = $1";
        strSQL = strSQL + " ,peso_ticket = $2";
        strSQL = strSQL + " ,sacos_ticket = $3"; //new

        strSQL = strSQL + " ,guia01 = $4";
        strSQL = strSQL + " ,guia_traslado01 = $5";
        strSQL = strSQL + " ,guia_sacos01 = $6";
        strSQL = strSQL + " ,e_peso01 = $7";
        strSQL = strSQL + " ,e_monto01 = $8";

        strSQL = strSQL + " ,guia02 = $9";
        strSQL = strSQL + " ,guia_traslado02 = $10";
        strSQL = strSQL + " ,guia_sacos02 = $11";
        strSQL = strSQL + " ,e_peso02 = $12";
        strSQL = strSQL + " ,e_monto02 = $13";

        strSQL = strSQL + " ,guia03 = $14";
        strSQL = strSQL + " ,guia_traslado03 = $15";
        strSQL = strSQL + " ,guia_sacos03 = $16";
        strSQL = strSQL + " ,e_peso03 = $17";
        strSQL = strSQL + " ,e_monto03 = $18";

        strSQL = strSQL + " WHERE ano = $19";
        strSQL = strSQL + " AND numero = $20";
        strSQL = strSQL + " AND item = $21";

        const result = await pool.query(strSQL,
        [   
            ticket,           //1
            peso_ticket,      //2
            sacos_ticket,     //3

            guia01,           //4
            guia_traslado01,  //5
            guia_sacos01,     //6
            e_peso01,         //7
            e_monto01,        //8

            guia02,           //9
            guia_traslado02,  //10
            guia_sacos02,     //11
            e_peso02,         //12
            e_monto02,        //13

            guia03,           //14
            guia_traslado03,  //15
            guia_sacos03,     //16
            e_peso03,         //17
            e_monto03,        //18

            ano,
            numero,
            item
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const actualizarOCargaTicket = async (req,res,next)=> {
    //Actualizacion para todos los items
    try {
        const {ano,numero} = req.params;
        const {
                ticket,         //1
                peso_ticket,    //2
                sacos_ticket    //3
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  ticket = $1";
        strSQL = strSQL + " ,peso_ticket = $2";
        strSQL = strSQL + " ,sacos_ticket = $3";

        strSQL = strSQL + " WHERE ano = $4";
        strSQL = strSQL + " AND numero = $5";

        const result = await pool.query(strSQL,
        [   
            ticket,         //1
            peso_ticket,    //2
            sacos_ticket,    //3

            ano,
            numero
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const agregarOCargaTicketTraslado = async (req,res,next)=> {
    let strSQL;
    var sAno;
    const {
        id_empresa,     //1
        id_punto_venta, //2
        fecha2,         //3
        //ano: calculado de la fecha
        numero,         //4
        //item: calculado funcion postgres
        id_producto,        //5
        descripcion,        //6
        cantidad,           //7
        operacion,          //8 descarguio
        registrado,         //9
        unidad_medida,      //10
        ticket_tras,        //11
        peso_ticket_tras,   //12
        sacos_ticket_tras,   //13
        tr_placacargado   //14
        } = req.body

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    console.log(fecha2);
    let datePieces = fecha2.split("-");
    const fechaArmada = new Date(datePieces[0],(datePieces[1]-1),datePieces[2]); //ok con hora 00:00:00
    //console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    //console.log(sAno); 

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";       //1
    strSQL = strSQL + " ,id_punto_venta";   //2
    strSQL = strSQL + " ,fecha";            //3
    strSQL = strSQL + " ,ano";              //calculado de fecha
    strSQL = strSQL + " ,numero";           //4 NEWWW
    strSQL = strSQL + " ,item";             //calculado funcion postgres
    ///////////////////////////////////////////////////
    strSQL = strSQL + " ,id_producto";          //5
    strSQL = strSQL + " ,descripcion";          //6
    strSQL = strSQL + " ,cantidad";             //7
    strSQL = strSQL + " ,operacion";            //8
    strSQL = strSQL + " ,registrado";           //9
    strSQL = strSQL + " ,unidad_medida";        //10

    strSQL = strSQL + " ,ctrl_insercion";       //
    strSQL = strSQL + " ,estado";               //
    strSQL = strSQL + " ,e_estibadores";        //

    strSQL = strSQL + " ,ticket_tras";       //11
    strSQL = strSQL + " ,peso_ticket_tras";  //12
    strSQL = strSQL + " ,sacos_ticket_tras"; //13
    strSQL = strSQL + " ,tr_placacargado"; //14
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,'" + sAno + "'";
    
    strSQL = strSQL + " ,$4"; //numero
    strSQL = strSQL + " ,(select * from fst_genera_ocarga_item($1,'" + sAno + "','" + numero + "'))";
    
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10"; //unidad_medida
    strSQL = strSQL + " ,current_timestamp";
    strSQL = strSQL + " ,'ATENDIDO'";
    strSQL = strSQL + " ,'-'"; //estibadores, para evitar el null en filtro principal
    strSQL = strSQL + " ,$11"; //new ticket_tras
    strSQL = strSQL + " ,$12"; //new peso_ticket_tras
    strSQL = strSQL + " ,$13"; //new sacos_ticket_tras
    strSQL = strSQL + " ,$14"; //new sacos_ticket_tras
    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,      //1
            id_punto_venta,  //2
            fecha2,          //3
            //ano: calculado de la fecha
            numero,          //4
            //item: calculado funcion postgres
            id_producto,        //5
            descripcion,        //6
            cantidad,           //7
            operacion,          //8
            registrado,          //9
            unidad_medida,          //10
            ticket_tras,        //11 new
            peso_ticket_tras,   //12 new
            sacos_ticket_tras,   //13 new
            tr_placacargado   //14
            ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const actualizarOCargaTicketTraslado = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        const {
                ticket_tras,         //1
                peso_ticket_tras,    //2
                sacos_ticket_tras    //3
                } = req.body        
 
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  ticket_tras = $1";
        strSQL = strSQL + " ,peso_ticket_tras = $2";
        strSQL = strSQL + " ,sacos_ticket_tras = $3";

        strSQL = strSQL + " WHERE ano = $4";
        strSQL = strSQL + " AND numero = $5";
        strSQL = strSQL + " AND item = $6";

        const result = await pool.query(strSQL,
        [   
            ticket_tras,         //1
            peso_ticket_tras,    //2
            sacos_ticket_tras,    //3
            ano,
            numero,
            item
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};


const obtenerTodasGuiasPendientes = async (req,res,next)=> {
    let strSQL;
    const {fecha} = req.params;

    strSQL = "select ano, numero, guia01 as guia, sum(e_monto01) as e_monto, '01' as grupo from mst_ocarga_detalle";
    strSQL = strSQL + " where e_rh is null";
    strSQL = strSQL + " and not guia01 is null";
    strSQL = strSQL + " and fecha between '" + fecha + "' and '" + fecha + "'";
    strSQL = strSQL + " group by ano, numero, guia01";

    strSQL = strSQL + " union all";

    strSQL = strSQL + " select ano, numero, guia02 as guia, sum(e_monto02) as e_monto, '02' as grupo from mst_ocarga_detalle";
    strSQL = strSQL + " where e_rh is null";
    strSQL = strSQL + " and not guia02 is null";
    strSQL = strSQL + " and fecha between '" + fecha + "' and '" + fecha + "'";
    strSQL = strSQL + " group by ano, numero, guia02";

    strSQL = strSQL + " union all";

    strSQL = strSQL + " select ano, numero, guia03 as guia, sum(e_monto03) as e_monto, '03' as grupo from mst_ocarga_detalle";
    strSQL = strSQL + " where e_rh is null";
    strSQL = strSQL + " and not guia03 is null";
    strSQL = strSQL + " and fecha between '" + fecha + "' and '" + fecha + "'";
    strSQL = strSQL + " group by ano, numero, guia03";

    console.log(strSQL);
    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }
    //res.send('Listado de todas los zonas');
};


module.exports = {
    obtenerTodasOCargasDet,
    obtenerOCargaDet,
    crearOCargaDet,
    agregarOCargaDet,
    agregarOCargaDetEjec,
    eliminarOCargaDet,
    actualizarOCargaDet01,
    actualizarOCargaDet02,
    actualizarOCargaDet03,
    actualizarOCargaTicket,
    agregarOCargaTicketTraslado,
    actualizarOCargaTicketTraslado,
    obtenerTodasGuiasPendientes
 }; 