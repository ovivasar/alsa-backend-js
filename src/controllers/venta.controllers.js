const pool = require('../db');

const obtenerTodasVentas = async (req,res,next)=> {
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
    strSQL = strSQL + " mve_venta ";
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
const obtenerVenta = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        let strSQL ;
        
        strSQL = "SELECT ";
        strSQL = strSQL + "  id_empresa";
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
        strSQL = strSQL + " ,cast(comprobante_original_fecemi as varchar)::varchar(50) as comprobante_original_fecemi";
        //strSQL = strSQL + " ,comprobante_original_fecemi";
        strSQL = strSQL + " ,documento_id";
        strSQL = strSQL + " ,razon_social";
        strSQL = strSQL + " ,debe";
        strSQL = strSQL + " ,peso_total";
        strSQL = strSQL + " ,registrado";
        strSQL = strSQL + " FROM mve_venta";
        
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
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
        id_empresa,        //1
        id_punto_venta,        //1
        tipo_op,        //1
        id_zona_venta,  //2
        zona_venta,     //3
        id_vendedor,    //4
        vendedor,       //5
        comprobante_original_fecemi, //6
        documento_id,   //7
        razon_social,   //8
        debe,           //9
        peso_total,      //10
        registrado      //11
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
    sSerie = (fechaArmada.getMonth()+1).toString(); // ok, se aumenta +1, por pinche regla js
    sSerie = sSerie.padStart(2,'0');

    /*
    const fecha = new Date(); //ok fecha y hora actual
    sSerie = fecha.getMonth(); // ok, se aumenta +1, por pinche regla js
    //const fecha = new Date("2022-10-29"); //ok con hora 00:00:00
    console.log(sSerie); */

    strSQL = "INSERT INTO mve_venta";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  id_empresa";
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
    strSQL = strSQL + " )";
    strSQL = strSQL + " VALUES";
    strSQL = strSQL + " (";
    strSQL = strSQL + "  $1";
    strSQL = strSQL + " ,$2";
    strSQL = strSQL + " ,$3";
    strSQL = strSQL + " ,$4";
    strSQL = strSQL + " ,$5";
    strSQL = strSQL + " ,$6";
    strSQL = strSQL + " ,$7";
    strSQL = strSQL + ",'" + sCod + "'";
    strSQL = strSQL + ",'" + sSerie + "'";
    strSQL = strSQL + " ,(select * from fve_genera_venta_sf(1,'" + sCod + "','" + sSerie + "'))";
    strSQL = strSQL + ",1"; //elemento
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$8";
    strSQL = strSQL + " ,$9";
    strSQL = strSQL + " ,$10";
    strSQL = strSQL + " ,$11";
    strSQL = strSQL + " ,$12";
    strSQL = strSQL + " ,$13";
    strSQL = strSQL + " ) RETURNING *";
    try {
        console.log(strSQL);
        const result = await pool.query(strSQL, 
        [   
            id_empresa,        //1
            id_punto_venta,        //1
            tipo_op,        //1
            id_zona_venta,  //2
            zona_venta,     //3
            id_vendedor,    //4
            vendedor,       //5
            comprobante_original_fecemi, //6
            documento_id,   //7
            razon_social,   //8
            debe,           //9
            peso_total,      //10
            registrado      //11
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
        strSQL = "DELETE FROM mve_venta ";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $1";
        strSQL = strSQL + " AND comprobante_original_serie = $2";
        strSQL = strSQL + " AND comprobante_original_numero = $3";
        strSQL = strSQL + " AND elemento = $4";
        
        console.log(strSQL,[cod,serie,num,elem]);
        const result = await pool.query(strSQL,[cod,serie,num,elem]);

        if (result.rowCount === 0)
            return res.status(404).json({
                message:"Venta no encontrada"
            });

        return res.sendStatus(204);
    } catch (error) {
        console.log(error.message);
    }

};
const actualizarVenta = async (req,res,next)=> {
    try {
        const {cod,serie,num,elem} = req.params;
        const {vendedor,id_vendedor,documento_id,razon_social} = req.body        
 
        var strSQL;
        strSQL = "UPDATE mve_venta SET ";
        strSQL = strSQL + "  id_vendedor = $1";
        strSQL = strSQL + " ,vendedor = $2";
        strSQL = strSQL + " ,documento_id = $3";
        strSQL = strSQL + " ,razon_social = $4";
        strSQL = strSQL + " WHERE comprobante_original_codigo = $5";
        strSQL = strSQL + " AND comprobante_original_serie = $6";
        strSQL = strSQL + " AND comprobante_original_numero = $7";
        strSQL = strSQL + " AND comprobante_original_elemento = $8";
 
        const result = await pool.query(strSQL,
        [   
            id_vendedor,
            vendedor,            
            documento_id,
            razon_social,
            cod,
            serie,
            num,
            elem
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
    obtenerVenta,
    crearVenta,
    eliminarVenta,
    actualizarVenta
 }; 