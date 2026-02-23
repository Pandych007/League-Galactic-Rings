const express = require("express");
const { Player, Team, User } = require("../models");
const { authenticate, authorize } = require("../middlewares/auth");
const router = express.Router();
const { Op } = require("sequelize");

// GET /admin/
//post /update/admin обновление статистики игрока
// router.post(
//   "/update",
//   authenticate,
//   authorize("admin"),
//   async (req, res, next) => {
//     try {
//       const playersStatistik = await Player.findAll();
//       if (playersStatistik.length === 0) {
//         return res
//           .status(404)
//           .json({ success: false, error: "игроки не найдены" });
//       }
//       for (const player of playersStatistik) {
//         const Newpoints = Math.floor(Math.random() * 26) + 5;
//         const Newrebounds = Math.floor(Math.random() * 9) + 2;
//         const Newassists = Math.floor(Math.random() * 8);
//         const Newfouls = Math.floor(Math.random() * 6);
//         const Newsteals = Math.floor(Math.random() * 4);
//         const Newturnovers = Math.floor(Math.random() * 6);
//         const Newblocks = Math.floor(Math.random() * 4);
//         await player.update({
//           points: Newpoints,
//           rebounds: Newrebounds,
//           assists: Newassists,
//           fouls: Newfouls,
//           steals: Newsteals,
//           turnovers: Newturnovers,
//           blocks: Newblocks,
//         });
//       }
//       res.json({
//         success: true,
//         message: "статистика игрокав обновленв",
//       });
//     } catch (error) {
//       next(error);
//     }
//   },
// );
router.post(
  "/update",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const playersStatistik = await Player.findAll();
      if (playersStatistik.length === 0) {
        return res
          .status(404)
          .json({ success: false, error: "игроки не найдены" });
      }

      for (const player of playersStatistik) {
        let Newpoints,
          Newrebounds,
          Newassists,
          Newfouls,
          Newsteals,
          Newturnovers,
          Newblocks;

        if ([35, 40, 45, 50, 55, 60, 65, 70, 75].includes(player.price)) {
          // Игрок с опытом
          Newpoints = Math.floor(Math.random() * 16) + 40; // 20–45 очков
          Newrebounds = Math.floor(Math.random() * 6) + 5; // 5–10 подборов
          Newassists = Math.floor(Math.random() * 5) + 3; // 3–7 передач
          Newfouls = Math.floor(Math.random() * 3) + 1; // 1–3 фола
          Newsteals = Math.floor(Math.random() * 3) + 1; // 1–3 перехвата
          Newturnovers = Math.floor(Math.random() * 3) + 1; // 1–3 потери
          Newblocks = Math.floor(Math.random() * 3) + 1; // 1–3 блока
        } else if ([10, 15, 20, 25, 30].includes(player.price)) {
          // Игрок слабого класса
          // Редкий шанс на супер-игру: 5%
          const rarePerformance = Math.random() < 0.05; // 5% шанс
          if (rarePerformance) {
            Newpoints = Math.floor(Math.random() * 6) + 35; // 35–40 очков
          } else {
            Newpoints = Math.floor(Math.random() * 11) + 5; // 5–15 очков
          }
          Newrebounds = Math.floor(Math.random() * 5) + 2; // 2–6 подборов
          Newassists = Math.floor(Math.random() * 4); // 0–3 передачи
          Newfouls = Math.floor(Math.random() * 3); // 0–2 фола
          Newsteals = Math.floor(Math.random() * 2); // 0–1 перехват
          Newturnovers = Math.floor(Math.random() * 4); // 0–3 потери
          Newblocks = Math.floor(Math.random() * 2); // 0–1 блок
        } else {
          // Стандартная генерация, если цена не входит в категории
          Newpoints = Math.floor(Math.random() * 26) + 5;
          Newrebounds = Math.floor(Math.random() * 9) + 2;
          Newassists = Math.floor(Math.random() * 8);
          Newfouls = Math.floor(Math.random() * 6);
          Newsteals = Math.floor(Math.random() * 4);
          Newturnovers = Math.floor(Math.random() * 6);
          Newblocks = Math.floor(Math.random() * 4);
        }

        await player.update({
          points: Newpoints,
          rebounds: Newrebounds,
          assists: Newassists,
          fouls: Newfouls,
          steals: Newsteals,
          turnovers: Newturnovers,
          blocks: Newblocks,
        });
      }

      res.json({
        success: true,
        message: "статистика игроков обновлена",
      });
    } catch (error) {
      next(error);
    }
  },
);

// GET /admin/players
router.get(
  "/players",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 20, position, status, search } = req.query;
      const offset = (page - 1) * limit;
      const where = {};
      if (position) {
        where.position = position;
      }
      if (status == "active") {
        where.is_active = true;
      } else {
        where.is_active = false;
      }
      if (search) {
        where.name = {
          [Op.like]: `%${search}%`,
        };
      }

      const { count, rows: players } = await Player.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
        includes: [
          {
            model: Team,
            as: "teams",
            attributes: ["id"],
            through: { attributes: [] },
          },
        ],
      });

      const playerWithTeamsCount = players.map((player) => ({
        ...player.toJSON(),
        teams_count: player.teams ? player.teams.length : 0,
      }));

      res.json({
        players: playerWithTeamsCount,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalPlayers: count,
      });
    } catch (error) {
      next(error);
    }
  },
);
//GET /admin/users
router.get(
  "/users",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search } = req.query;

      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where[Op.or] = [
          { name: { [Op.like]: `%${search}%` } },
          { email: { [Op.like]: `%${search}%` } },
        ];
      }

      const { count, rows: users } = await Player.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
        attributes: ["id", "name", "email", "role", "created_at", "updated_at"],
      });

      res.json({
        users,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalUsers: count,
      });
    } catch (error) {
      next(error);
    }
  },
);
//GET /admin/teams
router.get(
  "/teams",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const { page = 1, limit = 20, search } = req.query;
      const offset = (page - 1) * limit;
      const where = {};

      if (search) {
        where.name = {
          [Op.like]: `%${search}%`,
        };
      }

      const { count, rows: teams } = await Team.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [["created_at", "DESC"]],
        includes: [
          {
            model: User,
            as: "user",
            attributes: ["id", "name", "email"],
            through: { attributes: [] },
          },
          {
            model: Player,
            as: "players",
            attributes: ["id", "name", "position"],
            through: { attributes: [] },
          },
        ],
      });

      const teamsWithPlayerCount = teams.map((team) => ({
        ...team.toJSON(),
        player_count: team.players ? team.players.length : 0,
      }));

      res.json({
        teams: teamsWithPlayerCount,
        totalPages: Math.ceil(count / limit),
        currentPage: parseInt(page),
        totalTeams: count,
      });
    } catch (error) {
      next(error);
    }
  },
);
// /admin/teams/:id
router.delete(
  "/teams/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const team = await Team.findByPk(req.params.id, {
        include: [
          {
            model: Player,
            as: "players",
            through: { attributes: [] },
          },
        ],
      });

      if (!team) {
        return res.status(404).json({ error: "Команда не найдена" });
      }

      const playerIds = team.players.map((player) => player.id);
      if (playerIds.length > 0) {
        await Player.update(
          { is_active: true },
          {
            where: {
              id: {
                [Op.in]: playerIds,
              },
            },
          },
        );
      }

      await team.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// /admin/deleteUser для админа
router.delete(
  "/deleteUser/:id",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const user = await User.findByPk(req.params.id);

      if (!user) {
        return res.status(404).json({ error: "Пользователь не найдена" });
      }

      await user.destroy();
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// /admin/getAllUsers для админа
router.get(
  "/getAllUsers",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const users = await User.findAll();

      res.json({
        users: users,
      });
    } catch (error) {
      next(error);
    }
  },
);

router.get(
  "/changeBalanceUser",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    const { user_id, balance } = req.query;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Пользователь не найден",
      });
    }

    user.budget = balance;
    user.save();

    try {
      res.json({
        success: true,
        message: "Баланс у пользователя изменен",
      });
    } catch (error) {
      next(error);
    }
  },
);
router.get(
  "/clearTeams",
  authenticate,
  authorize("admin"),
  async (req, res, next) => {
    try {
      const teams = await Team.findAll({
        include: [
          {
            model: Player,
            as: "players",
            through: { attributes: [] },
          },
        ],
      });

      if (teams.length === 0) {
        return res.json({
          success: true,
          message: "Нет команд для удаления",
          deletedTeams: 0,
        });
      }

      let deletedCount = 0;
      let playersUpdated = 0;

      for (const team of teams) {
        const playerIds = team.players.map((player) => player.id);

        if (playerIds.length > 0) {
          const [updated] = await Player.update(
            { is_active: true },
            {
              where: {
                id: {
                  [Op.in]: playerIds,
                },
              },
            },
          );
          playersUpdated += updated;

          await team.setPlayers([]);
        }

        await team.destroy();
        deletedCount++;
      }

      res.json({
        success: true,
        message: "Все команды успешно удалены",
        deletedTeams: deletedCount,
        playersUpdated: playersUpdated,
      });
    } catch (error) {
      console.error("Ошибка при удалении команд:", error);
      next(error);
    }
  },
);

module.exports = router;
