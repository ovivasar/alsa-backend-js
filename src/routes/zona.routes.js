const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodasZonas,obtenerZona,crearZona, actualizarZona, eliminarZona} = require('../controllers/zona.controllers')

router.get('/zona', obtenerTodasZonas);
router.get('/zona/:id', obtenerZona);
router.post('/zona', crearZona);
router.put('/zona/:id', actualizarZona);
router.delete('/zona/:id', eliminarZona);

module.exports = router;