const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargas,obtenerTodasOCargasPlan,obtenerOCarga,crearOCarga,actualizarOCarga,eliminarOCarga} = require('../controllers/ocarga.controllers')

router.get('/ocarga', obtenerTodasOCargas);
router.get('/ocargaplan/:fecha_proceso', obtenerTodasOCargasPlan);
router.get('/ocarga/:ano/:numero', obtenerOCarga);
router.post('/ocarga', crearOCarga);
router.put('/ocarga/:ano/:numero', actualizarOCarga);
router.delete('/ocarga/:ano/:numero', eliminarOCarga);

module.exports = router;