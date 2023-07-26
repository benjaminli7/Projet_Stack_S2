const { Achievement, User } = require ('../db');
const {io, socketUserMap} = require('../index');

async function newAchievement(achievementName, userId) 
{
    const user = await User.findByPk(userId);
    const achievement = await Achievement.findOne({
        where: {
            name: achievementName
        }
    });


    const userAchievements = await user.getAchievements();
    const userAchievementsIds = userAchievements.map((achievement) => achievement.id);
    if (userAchievementsIds.includes(achievement.id)) {
        return;
    }

    await user.addAchievement(achievement);
    const userSocket = socketUserMap.get(parseInt(userId));

    if (userSocket) {
        io.to(userSocket).emit('achievement', { achievement: achievement, userId: userId });
    }   

    return achievement;
}
module.exports = {
    newAchievement,
}