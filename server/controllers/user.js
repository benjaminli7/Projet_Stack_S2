const userService = require("../services/user");
const { User , Achievement, Moderation} = require("../db");
const { Op } = require("sequelize");


module.exports = {
  cget: async (req, res, next) => {
    console.log("cget");
    const {
      _page = 1,
      _itemsPerPage = 10,
      _sort = {},
      ...criteria
    } = req.query; 
    try {
      const users = await userService.findAll(criteria, {
        offset: (_page - 1) * _itemsPerPage,
        limit: _itemsPerPage,
        order: _sort,
      });
      res.json(users);
    } catch (err) {
      next(err);
    }
  },
  post: async (req, res, next) => {
    try {
      console.log("post");
      const user = await userService.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      next(err);
    }
  },
  get: async (req, res, next) => {
    try {
      const user = await userService.findById(parseInt(req.params.id));
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  put: async (req, res, next) => {
    try {
      const nbRemoved = await userService.remove({
        id: parseInt(req.params.id),
      });
      const user = await userService.create({
        id: parseInt(req.params.id),
        ...req.body,
      });
      res.status(nbRemoved ? 200 : 201).json(user);
    } catch (err) {
      next(err);
    }
  },
  patch: async (req, res, next) => {
    try {
      const [user] = await userService.update(
        { id: parseInt(req.params.id) },
        req.body
      );
      if (!user) return res.sendStatus(404);
      res.json(user);
    } catch (err) {
      next(err);
    }
  },
  delete: async (req, res, next) => {
    try {
      const nbRemoved = await userService.remove({
        id: parseInt(req.params.id),
      });
      res.sendStatus(nbRemoved ? 204 : 404);
    } catch (err) {
      next(err);
    }
  },
  getUserAchievements: async (req, res, next) => {
    try {
      const user = await User.findByPk(parseInt(req.params.id));
      const allAchievements = await Achievement.findAll();
      let userAchievements = await user.getAchievements();
      const userAchievementsIds = userAchievements.map((achievement) => achievement.id);
  
  
  
      const achievements = allAchievements.map((achievement) => {
        const { id } = achievement;
        const unlocked = userAchievementsIds.includes(id);
  
        return {
          ...achievement.dataValues,
          unlocked,
        };
      });
      console.log(achievements);
  
      res.json(achievements);
    } catch (err) {
      next(err);
    }
  },
  reportUser: async (req, res, next) => {
    try {
      const user = req.user.infos;
      const { reportedUsername, reason } = req.body;
      const reportedUser = await User.findOne({where: {username: reportedUsername}});
      const lastReport = await Moderation.findOne({
        where: {
          reporterId: user.id,
          reportedPlayerId: reportedUser.id,
          createdAt: {
            [Op.gte]: new Date(new Date() - 5 * 60 * 1000),
          },
        },
      });
      
      if(lastReport) {
        return res.status(400).json({message: "You have already reported this user recently"});
      }


      if(!reportedUser) {
        return res.status(404).json({message: "User not found"});
      }
      const moderation = await Moderation.create({
        reason: reason,
        reporterId: user.id,
        reportedPlayerId: reportedUser.id,
      });

      res.status(201).json(moderation);

    } catch (err) {
      next(err);
    }
  }


  
};
