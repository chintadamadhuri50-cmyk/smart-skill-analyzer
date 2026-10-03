const router = require('express').Router();
const c = require('../controllers/analysisController');
router.post('/analyze', c.analyze);
router.get('/analysis', c.getAll);
router.get('/analysis/:id', c.getOne);
router.delete('/analysis/:id', c.remove);
module.exports = router;
