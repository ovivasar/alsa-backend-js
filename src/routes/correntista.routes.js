const {Router} = require('express');
const pool = require('../db');
const router = Router();
const {obtenerTodosCorrentistas,obtenerCorrentista,crearCorrentista,actualizarCorrentista,eliminarCorrentista} = require('../controllers/correntista.controllers')

router.get('/correntista', obtenerTodosCorrentistas);
router.get('/correntista/:id', obtenerCorrentista);
router.post('/correntista', crearCorrentista);
router.put('/correntista/:id', actualizarCorrentista);
router.delete('/correntista/:id', eliminarCorrentista);

module.exports = router;