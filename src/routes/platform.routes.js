const express = require('express');
const { requireAuth } = require('../middleware/auth');
const { getAchievements, getLeaderboard, getStats } = require('../repositories/platform.repository');

const router = express.Router();
router.get('/stats', requireAuth, async (req, res, next) => { try { res.json({ stats: await getStats(req.session.userId) }); } catch (error) { next(error); } });
router.get('/achievements', requireAuth, async (req, res, next) => { try { res.json({ achievements: await getAchievements(req.session.userId) }); } catch (error) { next(error); } });
router.get('/leaderboard', async (req, res, next) => { try { res.json({ leaderboard: await getLeaderboard() }); } catch (error) { next(error); } });
module.exports = router;
