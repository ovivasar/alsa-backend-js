const pool = require('../db');

const obtenerTodasVentasDet = async (req,res,next)=> {
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
    strSQL = strSQL + " mve_venta_det ";
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

const obtenerTodasVentasDetPendientes = async (req,res,next)=> {
    let strSQL;
    const {fecha} = req.params;
    strSQL = "    select ";
    strSQL = strSQL + "     (fve_inventario_basico.cod ";
    strSQL = strSQL + "     || '-' || fve_inventario_basico.serie";
    strSQL = strSQL + "     || '-' || fve_inventario_basico.numero";
    strSQL = strSQL + "     || '-' || fve_inventario_basico.item";
    strSQL = strSQL + "     )::varchar(500) as pedido,";
    strSQL = strSQL + "     fve_inventario_basico.ref_documento_id,";
    //strSQL = strSQL + "     mad_correntistas.razon_social as ref_razon_social,"; //esto no permite ver razon social de clientes nuevos (no reg en mad_correntistas plop)
    strSQL = strSQL + "     mve_venta_detalle.ref_razon_social,"; //esto no permite ver razon social de clientes nuevos (no reg en mad_correntistas plop)
    strSQL = strSQL + "     fve_inventario_basico.id_producto,";
    strSQL = strSQL + "     mst_producto.nombre,";
    strSQL = strSQL + "     fve_inventario_basico.id_zona_entrega,";
    strSQL = strSQL + "     mve_zonadet.nombre as zona_entrega,";
    strSQL = strSQL + "     cast(mve_venta_detalle.comprobante_original_fecemi as varchar) as fecha,";
    strSQL = strSQL + "     (fve_inventario_basico.ingresos-fve_inventario_basico.egresos)::numeric(14,3) as saldo,";
    strSQL = strSQL + "     mve_venta_detalle.tr_placa";
    strSQL = strSQL + "     from ";
    strSQL = strSQL + "     (";
    strSQL = strSQL + "     (";
    strSQL = strSQL + "     (";
    //fecha formato = yyyy/mm/dd (porfavor) auunque para postgres, le llega ;)
    strSQL = strSQL + "     fve_inventario_basico(1,'','" + fecha + "')";
    strSQL = strSQL + "     as ( cod varchar(5),";
    strSQL = strSQL + "         serie varchar(5),";
    strSQL = strSQL + "         numero varchar(10),";
    strSQL = strSQL + "         item integer,";
    strSQL = strSQL + "         ref_documento_id varchar(20),";
    strSQL = strSQL + "         id_producto varchar(20),";
    strSQL = strSQL + "         id_zona_entrega integer,";
    strSQL = strSQL + "         ingresos numeric(14,3),";
    strSQL = strSQL + "         egresos numeric(14,3)";
    strSQL = strSQL + "     ) left join mad_correntistas";
    strSQL = strSQL + "     on (fve_inventario_basico.ref_documento_id = mad_correntistas.documento_id)";
    strSQL = strSQL + "     ) left join mst_producto";
    strSQL = strSQL + "     on (fve_inventario_basico.id_producto = mst_producto.id_producto and";
    strSQL = strSQL + "             mst_producto.id_empresa=1	)";
    strSQL = strSQL + "     ) inner join mve_zonadet";
    strSQL = strSQL + "     on (fve_inventario_basico.id_zona_entrega = mve_zonadet.id_zonadet)";
    strSQL = strSQL + "     ) left join mve_venta_detalle";
    strSQL = strSQL + "     on (fve_inventario_basico.cod = mve_venta_detalle.comprobante_original_codigo and";
    strSQL = strSQL + "         fve_inventario_basico.serie = mve_venta_detalle.comprobante_original_serie and";
    strSQL = strSQL + "         fve_inventario_basico.numero = mve_venta_detalle.comprobante_original_numero and";         
    strSQL = strSQL + "         fve_inventario_basico.item = mve_venta_detalle.item)";
    strSQL = strSQL + "     where fve_inventario_basico.ingresos-fve_inventario_basico.egresos > 0";
    try {
        const todosReg = await pool.query(strSQL);
        res.json(todosReg.rows);
    }
    catch(error){
        console.log(error.message);
    }
    //res.send('Listado de todas los zonas');
};

const obtenerVentaDet = async (req,res,next)=> {
    //DEtalles de un Pedido
    try {
        const {cod,serie,num,elem} = req.params;
        let strSQL ;
        strSQL = "SELECT * ";
        strSQL = strSQL + " FROM mve_venta_detalle ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        strSQL = strSQL + " ORDER BY item";
        console.log(strSQL,[cod,serie,num,elem]);
        
        const result = await pool.query(strSQL,[cod,serie,num,elem]);
        
        //eSTE MENSAJE DE VENTGA NO ENCONTRADA, CONFUNDE AL BUCLE PARA RENDERIZAR LOS DATOS
        //MEJOR QUE SALGA ARRAY VACIO, AL MENOS ASI ENTIENDE QUE NO HAY NADA
        /*if (result.rows.length === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });*/

        //res.json(result.rows[0]);
        res.json(result.rows);
    } catch (error) {
        console.log(error.message);
    }
};

const obtenerVentaDetItem = async (req,res,next)=> {
    //DEtalles de un Pedido
    try {
        const {cod,serie,num,elem,item} = req.params;
        let strSQL ;
        strSQL = "SELECT mve_venta_detalle.*, cast(mve_venta_detalle.fecha_entrega as varchar)::varchar(50) as fecha_entrega2 FROM mve_venta_detalle ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        strSQL = strSQL + " AND item = $5";
        strSQL = strSQL + " ORDER BY item";
        //console.log(strSQL,[cod,serie,num,elem,item]);
        
        const result = await pool.query(strSQL,[cod,serie,num,elem,item]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Item no encontrado"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const obtenerVentaDetItemTrans = async (req,res,next)=> {
    //DEtalles de un Pedido
    try {
        const {cod,serie,num,elem,item} = req.params;
        let strSQL ;
        strSQL = "SELECT tr_ruc";
        strSQL = strSQL + " ,tr_razon_social";
        strSQL = strSQL + " ,tr_chofer";
        strSQL = strSQL + " ,tr_celular";
        strSQL = strSQL + " ,tr_placa";
        strSQL = strSQL + " ,cast(tr_fecha_carga as varchar)::varchar(50) as tr_fecha_carga";
        strSQL = strSQL + " FROM mve_venta_detalle ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        strSQL = strSQL + " AND item = $5";
        //console.log(strSQL,[cod,serie,num,elem,item]);
        
        const result = await pool.query(strSQL,[cod,serie,num,elem,item]);

        if (result.rows.length === 0)
            return res.status(404).json({
                message:"Item no encontrado"
            });

        res.json(result.rows[0]);
    } catch (error) {
        console.log(error.message);
    }
};

const crearVentaDet = async (req,res,next)=> {
    let strSQL;
    const {
        id_empresa,         //01
        id_punto_venta,     //02
        comprobante_original_codigo, //03
        comprobante_original_serie,  //04
        comprobante_original_numero, //05

        ref_documento_id,   //06
        ref_razon_social,   //07
        id_zona_entrega,    //08
        zona_entrega,       //09
        id_producto,            //10
        descripcion,        //11
        comprobante_original_fecemi, //12
        precio_unitario,    //13
        porc_igv,           //14
        cantidad,           //15
        ref_observacion,  //16
        registrado,          //17

        ref_direccion,          //18
        unidad_medida,          //19
        id_formapago,          //20
        formapago,          //21
        cond_venta,          //22
        cond_entrega,          //23
        fecha_entrega2          //24
        } = req.body
    //COD = Procesar zona_venta, para extraer siglas (LCH-LIMA) => LCH
    //SERIE = Procesar comprobante_original_fecemi, para extraer mes (28/10/2022) => 10

    //console.log(comprobante_original_fecemi);
    //cuidado con edicion manual de la fecha, se registra al reves, pero en caso de click va normal
    let datePieces = comprobante_original_fecemi.split("-");
    const fechaArmada = new Date(datePieces[0],datePieces[1],datePieces[2]); //ok con hora 00:00:00
    //console.log(datePieces);
    let sAno = (fechaArmada.getFullYear()).toString(); // new 

    strSQL = "INSERT INTO mve_venta_detalle";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
    strSQL = strSQL + " ,id_punto_venta";
    strSQL = strSQL + " ,ano"; //new
    strSQL = strSQL + " ,comprobante_original_codigo";
    strSQL = strSQL + " ,comprobante_original_serie";
    strSQL = strSQL + " ,comprobante_original_numero";
    strSQL = strSQL + " ,elemento";
    strSQL = strSQL + " ,item";
    strSQL = strSQL + " ,ref_documento_id";
    strSQL = strSQL + " ,ref_razon_social";
    strSQL = strSQL + " ,id_zona_entrega";
    strSQL = strSQL + " ,zona_entrega";
    strSQL = strSQL + " ,id_producto";
    strSQL = strSQL + " ,descripcion";
    strSQL = strSQL + " ,comprobante_original_fecemi";
    strSQL = strSQL + " ,precio_unitario";
    strSQL = strSQL + " ,porc_igv";
    strSQL = strSQL + " ,cantidad";
    strSQL = strSQL + " ,ref_observacion";
    strSQL = strSQL + " ,registrado";

    strSQL = strSQL + " ,ref_direccion";
    strSQL = strSQL + " ,unidad_medida";
    strSQL = strSQL + " ,id_formapago";
    strSQL = strSQL + " ,formapago";
    strSQL = strSQL + " ,cond_venta";
    strSQL = strSQL + " ,cond_entrega";
    strSQL = strSQL + " ,fecha_entrega";

    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,'" + sAno + "'"; //new
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + ",1"; //elemento
    //cuidado aqui en esta funcion hay que aumenta el año,. para generar toodo, le aumentamos arriba pero aqui en el item, aun mno lo esta considerando chingados
    strSQL = strSQL + " ,(select * from fve_genera_venta_item(1,'" + comprobante_original_codigo + "','" + comprobante_original_serie + "','" + comprobante_original_numero + "',1))"; //item
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
    
    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        console.log(        [   
            id_empresa,         //01
            id_punto_venta,     //02
            comprobante_original_codigo, //03
            comprobante_original_serie,  //04
            comprobante_original_numero, //05
            ref_documento_id,   //06
            ref_razon_social,   //07
            id_zona_entrega,    //08
            zona_entrega,       //09
            id_producto,            //10
            descripcion,        //11
            comprobante_original_fecemi, //12
            precio_unitario,    //13
            porc_igv,           //14
            cantidad,           //15
            ref_observacion,  //16
            registrado          //17
        ]
        );

        const result = await pool.query(strSQL, 
        [   
            id_empresa,         //01
            id_punto_venta,     //02
            comprobante_original_codigo, //03
            comprobante_original_serie,  //04
            comprobante_original_numero, //05
            ref_documento_id,   //06
            ref_razon_social,   //07
            id_zona_entrega,    //08
            zona_entrega,       //09
            id_producto,        //10
            descripcion,        //11
            comprobante_original_fecemi, //12
            precio_unitario,    //13
            porc_igv,           //14
            cantidad,           //15
            ref_observacion,    //16
            registrado,          //17
            
            ref_direccion,      //18
            unidad_medida,      //19
            id_formapago,       //20
            formapago,          //21
            cond_venta,         //22
            cond_entrega,       //23
            fecha_entrega2      //24
        ]
        );
        res.json(result.rows[0]);
    }catch(error){
        //res.json({error:error.message});
        next(error)
    }
};

const eliminarVentaDet = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem,item} = req.params;
        var strSQL;
        strSQL = "DELETE FROM mve_venta_detalle ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        strSQL = strSQL + " AND item = $5";
        
        console.log(strSQL,[cod,serie,num,elem,item]);
        const result = await pool.query(strSQL,[cod,serie,num,elem,item]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const actualizarVentaDet = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem,item} = req.params;
        const { 
                ref_documento_id,
                ref_razon_social,
                id_zona_entrega,
                zona_entrega,
                id_producto,
                descripcion,
                precio_unitario,
                porc_igv,
                cantidad,
                ref_observacion,
                ref_direccion,
                unidad_medida,
                id_formapago,
                formapago,
                cond_venta,
                cond_entrega,
                fecha_entrega2
            } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mve_venta_detalle SET ";
        strSQL = strSQL + "  ref_documento_id = $1";
        strSQL = strSQL + " ,ref_razon_social = $2";
        strSQL = strSQL + " ,id_zona_entrega = $3";
        strSQL = strSQL + " ,zona_entrega = $4";
        strSQL = strSQL + " ,id_producto = $5";
        strSQL = strSQL + " ,descripcion = $6";
        strSQL = strSQL + " ,precio_unitario = $7";
        strSQL = strSQL + " ,porc_igv = $8";
        strSQL = strSQL + " ,cantidad = $9";
        strSQL = strSQL + " ,ref_observacion = $10";
        
        strSQL = strSQL + " ,ref_direccion = $11";
        strSQL = strSQL + " ,unidad_medida = $12";
        strSQL = strSQL + " ,id_formapago = $13";
        strSQL = strSQL + " ,formapago = $14";
        strSQL = strSQL + " ,cond_venta = $15";
        strSQL = strSQL + " ,cond_entrega = $16";
        strSQL = strSQL + " ,fecha_entrega = $17";

        strSQL = strSQL + " WHERE comprobante_original_codigo = $18";
        strSQL = strSQL + " AND comprobante_original_serie = $19";
        strSQL = strSQL + " AND comprobante_original_numero = $20";
        strSQL = strSQL + " AND elemento = $21";
        strSQL = strSQL + " AND item = $22";
 
        const result = await pool.query(strSQL,
        [   
            ref_documento_id,
            ref_razon_social,
            id_zona_entrega,
            zona_entrega,
            id_producto,
            descripcion,
            precio_unitario,
            porc_igv,
            cantidad,
            ref_observacion,

            ref_direccion, //new
            unidad_medida, //new
            id_formapago,  //new
            formapago,     //new
            cond_venta,    //new
            cond_entrega,  //new
            fecha_entrega2, //new

            cod,
            serie,
            num,
            elem,
            item
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle de venta no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

const actualizarVentaDetTrans = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem,item} = req.params;
        const { 
                tr_ruc,
                tr_razon_social,
                tr_chofer,
                tr_celular,
                tr_placa,
                tr_fecha_carga,
            } = req.body        
 
        var strSQL;
        strSQL = "UPDATE mve_venta_detalle SET ";
        strSQL = strSQL + "  tr_ruc = $1";
        strSQL = strSQL + " ,tr_razon_social = $2";
        strSQL = strSQL + " ,tr_chofer = $3";
        strSQL = strSQL + " ,tr_celular = $4";
        strSQL = strSQL + " ,tr_placa = $5";
        strSQL = strSQL + " ,tr_fecha_carga = $6";

        strSQL = strSQL + " WHERE comprobante_original_codigo = $7";
        strSQL = strSQL + " AND comprobante_original_serie = $8";
        strSQL = strSQL + " AND comprobante_original_numero = $9";
        strSQL = strSQL + " AND elemento = $10";
        strSQL = strSQL + " AND item = $11";
 
        const result = await pool.query(strSQL,
        [   
            tr_ruc,
            tr_razon_social,
            tr_chofer,
            tr_celular,
            tr_placa,
            tr_fecha_carga,
            
            cod,
            serie,
            num,
            elem,
            item
        ]
        );

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Detalle de venta no encontrado"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    obtenerTodasVentasDet,
    obtenerTodasVentasDetPendientes,
    obtenerVentaDet,
    obtenerVentaDetItemTrans,
    obtenerVentaDetItem,
    crearVentaDet,
    eliminarVentaDet,
    actualizarVentaDet,
    actualizarVentaDetTrans
 }; 