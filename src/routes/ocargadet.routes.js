const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasOCargasDet,obtenerOCargaDet,crearOCargaDet,agregarOCargaDet,agregarOCargaTicketTraslado,actualizarOCargaDet01,actualizarOCargaDet02,actualizarOCargaDet03,actualizarOCargaTicket,eliminarOCargaDet,actualizarOCargaTicketTraslado,obtenerTodasGuiasPendientes, agregarOCargaDetEjec} = require('../controllers/ocargadet.controllers')

router.get('/ocargadettipo/:ano/:numero/:tipo', obtenerTodasOCargasDet); //cambiamos nombre ruta, para evitar confusion tmr
router.get('/ocargadet/:ano/:numero/:item', obtenerOCargaDet); //caso: general + estibaje
router.get('/ocargadetguiaspendientes/:fecha', obtenerTodasGuiasPendientes); //caso: mostrar guias pendientes pago
router.post('/ocargadet', crearOCargaDet); //caso: general por default
router.post('/ocargadetadd', agregarOCargaDet); //caso: AGREGADO 
router.post('/ocargadetaddejec', agregarOCargaDetEjec); //caso: AGREGADO NEW
router.post('/ocargatickettrasladoadd', agregarOCargaTicketTraslado); //caso: datos de ticket traslado

router.put('/ocargadet01/:ano/:numero/:item', actualizarOCargaDet01); //caso: datos generales
router.put('/ocargadet02/:ano/:numero/:item', actualizarOCargaDet02); //caso: datos generales
router.put('/ocargadet03/:ano/:numero/:item', actualizarOCargaDet03); //caso: datos generales
router.put('/ocargaticket/:ano/:numero', actualizarOCargaTicket); //caso: datos de ticket compartidos
router.put('/ocargatickettraslado/:ano/:numero/:item', actualizarOCargaTicketTraslado); //caso: datos de ticket traslado
router.delete('/ocargadet/:ano/:numero/:item', eliminarOCargaDet);

module.exports = router;