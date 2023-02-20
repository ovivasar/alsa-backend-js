const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargasDet,obtenerOCargaDet,crearOCargaDet,agregarOCargaDet,actualizarOCargaDet01,actualizarOCargaDet02,actualizarOCargaDet03,eliminarOCargaDet} = require('../controllers/ocargadet.controllers')

router.get('/ocargadet/:ano/:numero', obtenerTodasOCargasDet);
router.get('/ocargadet/:ano/:numero/:item', obtenerOCargaDet); //caso: general + estibaje
router.post('/ocargadet', crearOCargaDet); //caso: general por default
router.post('/ocargadetadd', agregarOCargaDet); //caso: AGREGADO NEW

router.put('/ocargadet01/:ano/:numero/:item', actualizarOCargaDet01); //caso: datos generales
router.put('/ocargadet02/:ano/:numero/:item', actualizarOCargaDet02); //caso: datos generales
router.put('/ocargadet03/:ano/:numero/:item', actualizarOCargaDet03); //caso: datos generales
router.delete('/ocargadet/:ano/:numero/:item', eliminarOCargaDet);

module.exports = router;