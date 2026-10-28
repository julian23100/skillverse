const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getProgress } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/', requireAuth, async (req, res, next) => { try { res.json({ progress: await getProgress(req.session.userId) }); } catch (error) { next(error); } });
module.exports = router;
