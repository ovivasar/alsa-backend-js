const express = require('express');
const res = require('express/lib/response');
const morgan = require('morgan');
const cors = require('cors');

const ocargadetRoutes = require('./src/routes/ocargadet.routes');
const ocargaRoutes = require('./src/routes/ocarga.routes');
const ventadetRoutes = require('./src/routes/ventadet.routes');
const ventaRoutes = require('./src/routes/venta.routes');
const productoRoutes = require('./src/routes/producto.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const correntistaRoutes = require('./src/routes/correntista.routes');
const zonaRoutes = require('./src/routes/zona.routes');
const zonadetRoutes = require('./src/routes/zonadet.routes');
const formapagoRoutes = require('./src/routes/formapago.routes');

const app = express();
const port = process.env.PORT || 4000;

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

app.listen(port);
console.log("Servidor puerto ", port);