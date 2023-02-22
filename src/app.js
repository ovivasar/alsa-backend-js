const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const cors = require('cors');

const ocargadetRoutes = require('./routes/ocargadet.routes');
const ocargaRoutes = require('./routes/ocarga.routes');
const ventadetRoutes = require('./routes/ventadet.routes');
const ventaRoutes = require('./routes/venta.routes');
const productoRoutes = require('./routes/producto.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const correntistaRoutes = require('./routes/correntista.routes');
const zonaRoutes = require('./routes/zona.routes');
const zonadetRoutes = require('./routes/zonadet.routes');
const formapagoRoutes = require('./routes/formapago.routes');

const app = express();

app.use(cors()); //comunica con otro backend

app.use(morgan('dev'));
app.use(express.json()); //para reconocer json en express, parametros POST

app.use(ocargadetRoutes);
app.use(ocargaRoutes);
app.use(ventadetRoutes);
app.use(ventaRoutes);
app.use(productoRoutes);
app.use(usuarioRoutes);
app.use(correntistaRoutes);
app.use(zonaRoutes);
app.use(zonadetRoutes);
app.use(formapagoRoutes);

app.use((err, req, res, next) => {
    return res.json({
        message: err.message
    })
})

app.listen(4000);
console.log("Servidor puerto 4000");