import express from 'express';
import { addMonitor, editMonitor, listMonitors,editTimeout} from '../controllers/monitor_controller';
import { addPingStat, listPingStats,specificPingStat } from '../controllers/ping_controller';
const router = express.Router();

router.post('/monitor', addMonitor);
router.get('/monitor', listMonitors);
router.put('/monitor/:name', editMonitor);
router.post('/monitor/stats/',addPingStat);
router.get('/monitor/stats',listPingStats);
router.put('/monitor/stats/:name',specificPingStat);
export default router;
