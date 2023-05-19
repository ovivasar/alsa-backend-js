const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasZonasDet,obtenerZonaDet,crearZonaDet, actualizarZonaDet, eliminarZonaDet} = require('../controllers/zonadet.controllers')

router.get('/zonadet', obtenerTodasZonasDet); //Zonas de Entrega al 100%
router.get('/zonadet/:id', obtenerZonaDet); //Entrega seleccionada
router.post('/zonadet', crearZonaDet);
router.put('/zonadet/:id', actualizarZonaDet);
router.delete('/zonadet/:id', eliminarZonaDet);
//router.put('/zonadet/:id/:iddet', actualizarZonaDet);
//router.delete('/zonadet/:id/:iddet', eliminarZonaDet);

module.exports = router;