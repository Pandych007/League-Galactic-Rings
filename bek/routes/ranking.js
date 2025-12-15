const express = require("express");
const { Player, Team, User, sequelize } = require("../models");
const router = express.Router();

router.get("/", async (req, res, next) => {
  console.log("Ok");

  const { count, rows: teams } = await Team.findAndCountAll({
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "name"],
      },
      {
        model: Player,
        as: "players",
        through: { attributes: [] },
        attributes: ["id"],
      },
    ],
    attributes: [
      "id",
      "name",
      [
        sequelize.fn(
          "COALESCE",
          sequelize.fn("SUM", sequelize.col("players.points")),
          0
        ),
        "players_points_sum",
      ],
    ],
    group: [
      "Team.id",
      "Team.name",
      "user.id",
      "user.name",
      "players.id",
      "points",
      "players->TeamPlayer.team_id",
      "players->TeamPlayer.player_id",
    ],
    subQuery: false,
  });

  const ranking = teams.map((team) => {
    //const playersPoint = team.players.reduce(
    //  (sum, player) => sum + parseFloat(player.points || 0)
    //);
    console.log(team.players.players_points_sum);
  });
});

module.exports = router;
