const express = require('express');
const GameSession = require('../models/GameSession');
const Question = require('../models/Question');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

// Start a new game session
router.post('/start', auth, async (req, res) => {
    const player = req.user.id;

    let session = await GameSession.findOne({ status: 'waiting' });
    
    if (!session) {
        session = new GameSession({ players: [player], status: 'waiting' });
    } else {
        session.players.push(player);
        session.status = 'ongoing';
        session.questions = await Question.aggregate([{ $sample: { size: 4 } }]);
    }

    await session.save();
    res.json({ message: 'Game started', session });
});

module.exports = router;
