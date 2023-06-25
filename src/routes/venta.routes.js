const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasVentas,obtenerTodasVentasPlan,obtenerVenta,crearVenta,actualizarVenta,anularVenta,eliminarVenta} = require('../controllers/venta.controllers')

router.get('/venta/:fecha_ini/:fecha_proceso', obtenerTodasVentas);//aumentado fecha_ini new 
router.get('/ventaplan/:fecha_ini/:fecha_proceso', obtenerTodasVentasPlan);

router.get('/venta/:cod/:serie/:num/:elem', obtenerVenta);
router.post('/venta', crearVenta);
router.put('/venta/:cod/:serie/:num/:elem', actualizarVenta);
router.put('/venta/:cod/:serie/:num/:elem/anular', anularVenta);
router.delete('/venta/:cod/:serie/:num/:elem', eliminarVenta);

module.exports = router;