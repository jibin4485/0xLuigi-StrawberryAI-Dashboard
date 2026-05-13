import express from 'express';
import { getPerformanceStats, allQuery } from '../db/queries.js';

const router = express.Router();

/**
 * GET /api/analytics
 * Get overall performance statistics
 */
router.get('/', async (req, res) => {
  try {
    const stats = await getPerformanceStats();
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/by-symbol
 * Get performance stats grouped by symbol
 */
router.get('/by-symbol', async (req, res) => {
  try {
    const stats = await allQuery(`
      SELECT
        symbol,
        COUNT(*) as total,
        SUM(CASE WHEN result = 'WON' THEN 1 ELSE 0 END) as won,
        SUM(CASE WHEN result = 'LOST' THEN 1 ELSE 0 END) as lost,
        ROUND(SUM(CASE WHEN result = 'WON' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as win_rate
      FROM signals
      WHERE status = 'CLOSED'
      GROUP BY symbol
      ORDER BY total DESC
    `);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching symbol analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/analytics/daily
 * Get daily performance stats
 */
router.get('/daily', async (req, res) => {
  try {
    const stats = await allQuery(`
      SELECT
        DATE(posted_at) as date,
        COUNT(*) as total,
        SUM(CASE WHEN result = 'WON' THEN 1 ELSE 0 END) as won,
        SUM(CASE WHEN result = 'LOST' THEN 1 ELSE 0 END) as lost,
        ROUND(SUM(CASE WHEN result = 'WON' THEN 1 ELSE 0 END) * 100.0 / COUNT(*), 2) as win_rate
      FROM signals
      WHERE status = 'CLOSED'
      GROUP BY DATE(posted_at)
      ORDER BY date DESC
      LIMIT 30
    `);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching daily analytics:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
