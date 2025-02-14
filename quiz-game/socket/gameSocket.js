const GameSession = require('../models/GameSession');

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New player connected');

        socket.on('game:init', async (data) => {
            console.log('game:init');
            const session = await GameSession.findById(data.sessionId).populate('questions');
            socket.join(data.sessionId);
            io.to(data.sessionId).emit('question:send', { question: session.questions[0] });
        });
        socket.on('user:register', (userId) => {
            socket.join(userId);
            console.log(`User ${userId} joined their private room.`);
        });
        socket.on("answer:submit", async ({ sessionId, userId, answer }) => {
            const session = await GameSession.findById(sessionId).populate("questions")
            if (!session) return;


            if (!session.userProgress) session.userProgress = new Map();
            if (!session.scores) session.scores = new Map();


            let userQuestionIndex = session.userProgress.get(userId) || 0;


            if (session?.questions?.[userQuestionIndex]?.correctAnswer === answer) {
                session.scores.set(userId, (session.scores.get(userId) || 0) + 1);
            }


            userQuestionIndex++;
            session.userProgress.set(userId, userQuestionIndex);
            await session.save();

            const userProgress = Array.from(session.userProgress.values());
            const allFinished = userProgress.length > 0 && userProgress.every(index => index >= session.questions.length);
            

            if (userQuestionIndex >= session.questions.length) {
                io.to(userId).emit("waiting");
            }

            if (allFinished) {
                session.status = 'finished';
                await session.save();
                io.to(sessionId).emit("game:end", { scores: session.scores });
            } else {
                const nextQuestion = session.questions[userQuestionIndex];
                if (nextQuestion) {
                    io.to(userId).emit("question:send", { question: nextQuestion });
                }
            }
        });

        socket.on('disconnect', () => {
            console.log('Player disconnected');
        });
    });
};
