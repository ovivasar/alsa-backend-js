const pool = require('../db');

const obtenerTodasOCargasDet = async (req,res,next)=> {
    let strSQL;
    const {ano,numero} = req.params;
    
    strSQL = "SELECT ";
    strSQL = strSQL + "  mst_ocarga_detalle.*";
    strSQL = strSQL + " ,cast(mst_ocarga_detalle.fecha as varchar)::varchar(50) as fecha2";
    strSQL = strSQL + " ,(mst_ocarga_detalle.ref_cod || '-' || mst_ocarga_detalle.ref_serie || '-' || mst_ocarga_detalle.ref_numero)::varchar(100) as pedido ";

    strSQL = strSQL + " FROM mst_ocarga_detalle";
    strSQL = strSQL + " WHERE ano = $1";
    strSQL = strSQL + " AND numero = $2";

    try {
        const todosReg = await pool.query(strSQL,[ano,numero]);
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
        
        strSQL = "SELECT ";
        strSQL = strSQL + "  mst_ocarga_detalle.*";
        strSQL = strSQL + " ,cast(mst_ocarga_detalle.fecha as varchar)::varchar(50) as fecha2";
        strSQL = strSQL + " ,(mst_ocarga_detalle.ref_cod || '-' || mst_ocarga_detalle.ref_serie || '-' || mst_ocarga_detalle.ref_numero)::varchar(100) as pedido ";
        strSQL = strSQL + " FROM mst_ocarga_detalle";
        strSQL = strSQL + " WHERE ano = $1";
        strSQL = strSQL + " AND numero = $2";
        strSQL = strSQL + " AND item = $3";
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
        id_empresa,     //1
        id_punto_venta, //2
        fecha2,          //3
        //ano: calculado de la fecha
        //numero,        //
        //item: calculado funcion postgres
        operacion,      //4
        ticket,         //5
        guia,           //6
        tr_ruc,         //7
        tr_razon_social,//8
        tr_chofer,      //9
        tr_celular,     //10    
        tr_placa,       //11
        id_zona_entrega,//12
        zona_entrega,   //13    
        id_producto,       //14
        descripcion,    //15
        documento_id,   //16
        razon_social,   //17
        desag_sacos,    //18
        desag_tn,       //19
        llega_sacos,    //20
        operacion2,     //21
        sacos_transb,   //22
        sacos_descar,   //23
        lote_asignado,  //24
        sacos_carga,    //25
        lote_procedencia,//26
        sacos_final,    //27
        tara_desag,      //28

        e_peso,         //29
        e_monto,        //30
        e_razon_social, //31
        e_rh,           //32
        
        e_hora_ini,     //33
        e_hora_fin,     //34
        
        e_estibadores,  //35
        e_observacion,  //36
        registrado      //37
        
        } = req.body

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    //console.log(fecha2);
    let datePieces = fecha2.split("-");
    //console.log(datePieces);

    const fechaArmada = new Date(datePieces[0],(datePieces[1]-1),datePieces[2]); //ok con hora 00:00:00
    
    //console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    //console.log(sAno);

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
    strSQL = strSQL + " ,id_punto_venta";
    strSQL = strSQL + " ,fecha";
    strSQL = strSQL + " ,ano"; //calculado de fecha
    strSQL = strSQL + " ,numero";//funcion postgres
    strSQL = strSQL + " ,item"; //funcion postgres
    strSQL = strSQL + " ,operacion";    
    strSQL = strSQL + " ,ticket";
    strSQL = strSQL + " ,guia";
    strSQL = strSQL + " ,tr_ruc";
    strSQL = strSQL + " ,tr_razon_social";
    strSQL = strSQL + " ,tr_chofer";
    strSQL = strSQL + " ,tr_celular";
    strSQL = strSQL + " ,tr_placa";
        //ref pedido 3 columnas
    strSQL = strSQL + " ,id_zona_entrega";
    strSQL = strSQL + " ,zona_entrega";
    strSQL = strSQL + " ,id_producto";
    strSQL = strSQL + " ,descripcion";
    strSQL = strSQL + " ,documento_id";
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
    strSQL = strSQL + " ,ctrl_insercion";
    
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
    strSQL = strSQL + " ,$15";
    strSQL = strSQL + " ,$16";
    strSQL = strSQL + " ,$17";
    strSQL = strSQL + " ,$18";
    strSQL = strSQL + " ,$19";
    strSQL = strSQL + " ,$20";
    strSQL = strSQL + " ,$21";
    strSQL = strSQL + " ,$22";
    strSQL = strSQL + " ,$23";
    strSQL = strSQL + " ,$24";
    strSQL = strSQL + " ,$25";
    strSQL = strSQL + " ,$26";
    strSQL = strSQL + " ,$27";
    strSQL = strSQL + " ,$28";
    strSQL = strSQL + " ,$29";

    strSQL = strSQL + " ,$30";
    strSQL = strSQL + " ,$31";
    strSQL = strSQL + " ,$32";
    if (e_hora_ini===""){
    strSQL = strSQL + " ,null";    
    }
    else{
    strSQL = strSQL + " ,'" + e_hora_ini + "'";
    }
    if (e_hora_fin===""){
    strSQL = strSQL + " ,null";    
    }
    else{
    strSQL = strSQL + " ,'" + e_hora_fin + "'";
    }

    strSQL = strSQL + " ,$33";
    strSQL = strSQL + " ,$34";
    strSQL = strSQL + " ,$35";
    strSQL = strSQL + " ,current_timestamp";

    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log("hora ini: ", e_hora_ini);
        console.log("hora fin: ", e_hora_fin);
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,     //1
            id_punto_venta, //2
            fecha2,          //3
            //ano: calculado de la fecha
            //numero,        //
            //item: calculado funcion postgres
            operacion,      //4
            ticket,         //5
            guia,           //6
            tr_ruc,         //7
            tr_razon_social,//8
            tr_chofer,      //9
            tr_celular,     //10    
            tr_placa,       //11
            id_zona_entrega,//12
            zona_entrega,   //13    
            id_producto,       //14
            descripcion,    //15
            documento_id,   //16
            razon_social,   //17
            desag_sacos,    //18
            desag_tn,       //19
            llega_sacos,    //20
            operacion2,     //21
            sacos_transb,   //22
            sacos_descar,   //23
            lote_asignado,  //24
            sacos_carga,    //25
            lote_procedencia,//26
            sacos_final,     //27
            tara_desag,      //28

            e_peso,         //29
            e_monto,        //30
            e_razon_social, //31
            e_rh,           //32
            
            /*e_hora_ini,     //33 se trata con variable, por formato de hora
            e_hora_fin,     //34 se trata con variable, por formato de hora
            */
            e_estibadores,  //33
            e_observacion,  //34
    
            registrado      //35
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
        fecha2,          //3
        //ano: calculado de la fecha
        numero,         //4
        //item: calculado funcion postgres
        operacion,      //5
        ticket,         //6
        guia,           //7
        tr_ruc,         //8
        tr_razon_social,//9
        tr_chofer,      //10
        tr_celular,     //11    
        tr_placa,       //12
        id_zona_entrega,//13
        zona_entrega,   //14    
        id_producto,       //15
        descripcion,    //16
        documento_id,//17
        razon_social,//18
        desag_sacos,    //19
        desag_tn,       //20
        llega_sacos,    //21
        operacion2,     //22
        sacos_transb,   //23
        sacos_descar,   //24
        lote_asignado,  //25
        sacos_carga,    //26
        lote_procedencia,//27
        sacos_final,    //28
        tara_desag,      //29
        
        e_peso,         //30
        e_monto,        //31
        e_razon_social, //32
        e_rh,           //33
        e_hora_ini,     //34
        e_hora_fin,     //35
        e_estibadores,  //36
        e_observacion,  //37
        
        registrado,      //38
        pedido      //39
        } = req.body

    //cuando llega con dd/mm/yyyy o dd-mm-yyyy hay que invertir el orden, sino sale invalido
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    console.log(fecha2);
    let datePieces = fecha2.split("-");
    const fechaArmada = new Date(datePieces[0],(datePieces[1]-1),datePieces[2]); //ok con hora 00:00:00
    //console.log(fechaArmada);
    sAno = (fechaArmada.getFullYear()).toString(); // ok, se aumenta +1, por pinche regla js
    //console.log(sAno); 

    let pedidoPieces = pedido.split("-");
    const sRefCod=pedidoPieces[0];
    const sRefSerie=pedidoPieces[1];
    const sRefNumero=pedidoPieces[2];
    const sRefItem=pedidoPieces[3];

    strSQL = "INSERT INTO mst_ocarga_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
    strSQL = strSQL + " ,id_punto_venta";
    strSQL = strSQL + " ,fecha";
    strSQL = strSQL + " ,ano"; //calculado de fecha
    strSQL = strSQL + " ,numero";
    strSQL = strSQL + " ,item"; //funcion postgres
    strSQL = strSQL + " ,operacion";    
    strSQL = strSQL + " ,ticket";
    strSQL = strSQL + " ,guia";
    strSQL = strSQL + " ,tr_ruc";
    strSQL = strSQL + " ,tr_razon_social";
    strSQL = strSQL + " ,tr_chofer";
    strSQL = strSQL + " ,tr_celular";
    strSQL = strSQL + " ,tr_placa";

    strSQL = strSQL + " ,ref_cod";
    strSQL = strSQL + " ,ref_serie";
    strSQL = strSQL + " ,ref_numero";
    strSQL = strSQL + " ,ref_item";
        //ref pedido 3 columnas
    strSQL = strSQL + " ,id_zona_entrega";
    strSQL = strSQL + " ,zona_entrega";
    strSQL = strSQL + " ,id_producto";
    strSQL = strSQL + " ,descripcion";
    strSQL = strSQL + " ,documento_id";
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
    
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,'" + sRefCod + "'";
    strSQL = strSQL + " ,'" + sRefSerie + "'";
    strSQL = strSQL + " ,'" + sRefNumero + "'";
    strSQL = strSQL + " ,'" + sRefItem + "'";
    strSQL = strSQL + " ,$13";
    strSQL = strSQL + " ,$14";
    strSQL = strSQL + " ,$15";
    strSQL = strSQL + " ,$16";
    strSQL = strSQL + " ,$17";
    strSQL = strSQL + " ,$18";
    strSQL = strSQL + " ,$19";
    strSQL = strSQL + " ,$20";
    strSQL = strSQL + " ,$21";
    strSQL = strSQL + " ,$22";
    strSQL = strSQL + " ,$23";
    strSQL = strSQL + " ,$24";
    strSQL = strSQL + " ,$25";
    strSQL = strSQL + " ,$26";
    strSQL = strSQL + " ,$27";
    strSQL = strSQL + " ,$28";
    strSQL = strSQL + " ,$29";
    strSQL = strSQL + " ,$30";

    strSQL = strSQL + " ,$31";
    strSQL = strSQL + " ,$32";
    strSQL = strSQL + " ,$33";
    strSQL = strSQL + " ,$34";
    strSQL = strSQL + " ,$35";
    strSQL = strSQL + " ,$36";
    strSQL = strSQL + " ,$37";
    strSQL = strSQL + " ,$38";
    strSQL = strSQL + " ) RETURNING *";
    try {
        //console.log("hora ini: ", e_hora_ini);
        //console.log("hora fin: ", e_hora_fin);
        //console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,     //1
            id_punto_venta, //2
            fecha2,          //3
            //ano: calculado de la fecha
            numero,         //4
            //item: calculado funcion postgres
            operacion,      //5
            ticket,         //6
            guia,           //7
            tr_ruc,         //8
            tr_razon_social,//9
            tr_chofer,      //10
            tr_celular,     //11    
            tr_placa,       //12
            id_zona_entrega,//13
            zona_entrega,   //14    
            id_producto,       //15
            descripcion,    //16
            documento_id,//17
            razon_social,//18
            desag_sacos,    //19
            desag_tn,       //20
            llega_sacos,    //21
            operacion2,     //22
            sacos_transb,   //23
            sacos_descar,   //24
            lote_asignado,  //25
            sacos_carga,    //26
            lote_procedencia,//27
            sacos_final,    //28
            tara_desag,      //29
            
            e_peso,         //30
            e_monto,        //31
            e_razon_social, //32
            e_rh,           //33
            e_hora_ini,     //34
            e_hora_fin,     //35
            e_estibadores,  //36
            e_observacion,  //37
    
            registrado      //38
            ]
        );
        res.json(result.rows[0]);
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
        strSQL = strSQL + " AND item = $3";
        
        const result = await pool.query(strSQL,[ano,numero,item]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle de Orden de Carga no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarOCargaDet = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        const {
                operacion,  //1
                ticket,     //2
                guia,       //3
                tr_ruc,     //4
                tr_razon_social,//5
                tr_chofer,      //6
                tr_celular,     //7     
                tr_placa,       //8
                id_zona_entrega,//9
                zona_entrega,   //10    
                id_producto,       //11
                descripcion,    //12
                documento_id,//13
                razon_social,//14
                desag_sacos,    //15
                desag_tn,       //16
                llega_sacos,    //17
                operacion2,     //18
                sacos_transb,   //19
                sacos_descar,   //20
                lote_asignado,  //21
                sacos_carga,    //22
                lote_procedencia,//23
                sacos_final,    //24
                tara_desag,      //25

                e_peso,         //26
                e_monto,        //27
                e_razon_social, //28
                e_rh,           //29
                e_hora_ini,     //30
                e_hora_fin,     //31
                e_estibadores,  //32
                e_observacion,   //33
                fecha2   //34
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  operacion = $1";
        strSQL = strSQL + " ,ticket = $2";
        strSQL = strSQL + " ,guia = $3";
        strSQL = strSQL + " ,tr_ruc = $4";
        strSQL = strSQL + " ,tr_razon_social = $5";
        strSQL = strSQL + " ,tr_chofer = $6";
        strSQL = strSQL + " ,tr_celular = $7";
        strSQL = strSQL + " ,tr_placa = $8";
        strSQL = strSQL + " ,id_zona_entrega = $9";
        strSQL = strSQL + " ,zona_entrega = $10";
        strSQL = strSQL + " ,id_producto = $11";
        strSQL = strSQL + " ,descripcion = $12";
        strSQL = strSQL + " ,documento_id = $13";
        strSQL = strSQL + " ,razon_social = $14";
        strSQL = strSQL + " ,desag_sacos = $15";
        strSQL = strSQL + " ,desag_tn = $16";
        strSQL = strSQL + " ,llega_sacos = $17";
        strSQL = strSQL + " ,operacion2 = $18";
        strSQL = strSQL + " ,sacos_transb = $19";
        strSQL = strSQL + " ,sacos_descar = $20";
        strSQL = strSQL + " ,lote_asignado = $21";
        strSQL = strSQL + " ,sacos_carga = $22";
        strSQL = strSQL + " ,lote_procedencia = $23";
        strSQL = strSQL + " ,sacos_final = $24";
        strSQL = strSQL + " ,tara_desag = $25";

        strSQL = strSQL + " ,e_peso = $26";
        strSQL = strSQL + " ,e_monto = $27";
        strSQL = strSQL + " ,e_razon_social = $28";
        strSQL = strSQL + " ,e_rh = $29";
        strSQL = strSQL + " ,e_hora_ini = $30";
        strSQL = strSQL + " ,e_hora_fin = $31";
        strSQL = strSQL + " ,e_estibadores = $32";
        strSQL = strSQL + " ,e_observacion = $33";
        strSQL = strSQL + " ,fecha = $34";
        strSQL = strSQL + " ,ctrl_modifica = current_timestamp";

        strSQL = strSQL + " WHERE ano = $35";
        strSQL = strSQL + " AND numero = $36";
        strSQL = strSQL + " AND item = $37";

        const result = await pool.query(strSQL,
        [   
            operacion,  //1
            ticket,     //2
            guia,       //3
            tr_ruc,     //4
            tr_razon_social,//5
            tr_chofer,      //6
            tr_celular,     //7     
            tr_placa,       //8
            id_zona_entrega,//9
            zona_entrega,   //10    
            id_producto,       //11
            descripcion,    //12
            documento_id,//13
            razon_social,//14
            desag_sacos,    //15
            desag_tn,       //16
            llega_sacos,    //17
            operacion2,     //18
            sacos_transb,   //19
            sacos_descar,   //20
            lote_asignado,  //21
            sacos_carga,    //22
            lote_procedencia,//23
            sacos_final,    //24
            tara_desag,     //25

            e_peso,         //26
            e_monto,        //27
            e_razon_social, //28
            e_rh,           //29
            e_hora_ini,     //30
            e_hora_fin,     //31
            e_estibadores,  //32
            e_observacion,   //33
            fecha2,   //34

            ano,            //34
            numero,         //35 
            item            //36
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

const actualizarOCargaEstiba = async (req,res,next)=> {
    try {
        const {ano,numero,item} = req.params;
        const {
                e_peso,         //1
                e_monto,        //2
                e_razon_social, //3
                e_rh,           //4
                e_hora_ini,     //5
                e_hora_fin,     //6
                e_estibadores,  //7     
                e_observacion   //8
                } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mst_ocarga_detalle SET ";
        strSQL = strSQL + "  e_peso = $1";
        strSQL = strSQL + " ,e_monto = $2";
        strSQL = strSQL + " ,e_razon_social = $3";
        strSQL = strSQL + " ,e_rh = $4";
        strSQL = strSQL + " ,e_hora_ini = $5";
        strSQL = strSQL + " ,e_hora_fin = $6";
        strSQL = strSQL + " ,e_estibadores = $7";
        strSQL = strSQL + " ,e_observacion = $8";
        strSQL = strSQL + " WHERE ano = $9";
        strSQL = strSQL + " AND numero = $10";
        strSQL = strSQL + " AND item = $11";

        const result = await pool.query(strSQL,
        [   
            e_peso,         //1
            e_monto,        //2
            e_razon_social, //3
            e_rh,           //4
            e_hora_ini,     //5
            e_hora_fin,     //6
            e_estibadores,  //7     
            e_observacion,  //8
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

module.exports = {
    obtenerTodasOCargasDet,
    obtenerOCargaDet,
    crearOCargaDet,
    agregarOCargaDet,
    eliminarOCargaDet,
    actualizarOCargaDet,
    actualizarOCargaEstiba
 }; 