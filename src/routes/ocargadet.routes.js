const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargasDet,obtenerOCargaDet,crearOCargaDet,agregarOCargaDet,actualizarOCargaDet,eliminarOCargaDet} = require('../controllers/ocargadet.controllers')

router.get('/ocargadet/:ano/:numero', obtenerTodasOCargasDet);
router.get('/ocargadet/:ano/:numero/:item', obtenerOCargaDet); //caso: general + estibaje
router.post('/ocargadet', crearOCargaDet); //caso: general por default
router.post('/ocargadetadd', agregarOCargaDet); //caso: AGREGADO NEW
router.put('/ocargadet/:ano/:numero/:item', actualizarOCargaDet); //caso: datos generales
router.delete('/ocargadet/:ano/:numero/:item', eliminarOCargaDet);

module.exports = router;