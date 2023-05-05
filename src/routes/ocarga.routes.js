const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargas,obtenerTodasOCargasPlan,obtenerTodasOCargasPlanTransb,obtenerOCarga,crearOCarga,actualizarOCarga,eliminarOCarga} = require('../controllers/ocarga.controllers')

router.get('/ocarga/:fecha_proceso', obtenerTodasOCargas); //formato resumido (ocarga_detalle)
router.get('/ocargaplan/:fecha_ini/:fecha_proceso/:tipo', obtenerTodasOCargasPlan); //formato analizado

router.get('/ocargaplantransb/:fecha_proceso', obtenerTodasOCargasPlanTransb); //formato analizado (ocarga_detalle)
router.get('/ocarga/:ano/:numero', obtenerOCarga);
router.post('/ocarga', crearOCarga);
router.put('/ocarga/:ano/:numero', actualizarOCarga);
router.delete('/ocarga/:ano/:numero', eliminarOCarga);

module.exports = router;