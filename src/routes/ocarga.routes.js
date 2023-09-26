const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargas,obtenerTodasOCargasPlan,obtenerTodasOCargasPlanTransb,obtenerOCarga,crearOCarga,actualizarOCarga,eliminarOCarga, obtenerTodasOCargasPlanCrossTab1, obtenerTodasOCargasPlanCrossTab2, obtenerTodasOCargasPlanCrossTab3, obtenerTodasOCargasPlanCrossTab4, obtenerTodasOCargasPlanCrossTab5, obtenerTodasOCargasPlanCrossTab1Det} = require('../controllers/ocarga.controllers')

router.get('/ocarga/:fecha_proceso', obtenerTodasOCargas); //formato resumido (ocarga_detalle)
router.get('/ocargaplan/:fecha_ini/:fecha_proceso/:tipo', obtenerTodasOCargasPlan); //formato analizado
router.get('/ocargaplancrosstab1/:fecha_ini/:fecha_proceso', obtenerTodasOCargasPlanCrossTab1); //new
router.get('/ocargaplancrosstab1det/:fecha_ini/:fecha_proceso/:codigo', obtenerTodasOCargasPlanCrossTab1Det); //new
router.get('/ocargaplancrosstab2/:fecha_ini/:fecha_proceso', obtenerTodasOCargasPlanCrossTab2); //new
router.get('/ocargaplancrosstab3/:fecha_ini/:fecha_proceso', obtenerTodasOCargasPlanCrossTab3); //new
router.get('/ocargaplancrosstab4/:fecha_ini/:fecha_proceso', obtenerTodasOCargasPlanCrossTab4); //new
router.get('/ocargaplancrosstab5/:fecha_ini/:fecha_proceso', obtenerTodasOCargasPlanCrossTab5); //new

router.get('/ocargaplantransb/:fecha_proceso', obtenerTodasOCargasPlanTransb); //formato analizado (ocarga_detalle)
router.get('/ocarga/:ano/:numero', obtenerOCarga);
router.post('/ocarga', crearOCarga);
router.put('/ocarga/:ano/:numero', actualizarOCarga);
router.delete('/ocarga/:ano/:numero', eliminarOCarga);

module.exports = router;