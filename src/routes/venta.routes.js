const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasVentas,obtenerTodasVentasPlan,obtenerVenta,crearVenta,actualizarVenta,eliminarVenta} = require('../controllers/venta.controllers')

router.get('/venta/:fecha_proceso', obtenerTodasVentas);//aumentado fecha_proceso
router.get('/ventaplan/:fecha_ini/:fecha_proceso', obtenerTodasVentasPlan); //new

router.get('/venta/:cod/:serie/:num/:elem', obtenerVenta);
router.post('/venta', crearVenta);
router.put('/venta/:cod/:serie/:num/:elem', actualizarVenta);
router.delete('/venta/:cod/:serie/:num/:elem', eliminarVenta);

module.exports = router;