const express = require("express");
const { Player, Team, User } = require("../models");
const { authenticate } = require("../middlewares/auth");
const router = express.Router();
const { Op } = require("sequelize");
const path = require("path");
const fs = require("fs");
const upload = require("../middlewares/upload");
const sharp = require("sharp");

router.post(
  "/upload",
  authenticate,
  upload.single("avatar"),
  async (req, res, next) => {
    console.log("upload");
    try {
      if (!req.file) {
        return res.status(400).json({ error: "Файл не загружен" });
      }
      console.log("Файд зашружен", req.file);
      const filePath = req.file.path;
      const pPath = path.parse(filePath);
      const optPqth = path.join(pPath.dir, `${pPath.name}-op.jpg`);
      await sharp(filePath)
        .resize(300, 300, {
          fit: "cover",
          position: "center",
        })
        .jpeg({ quality: 80 })
        .toFile(optPqth);

      fs.unlinkSync(filePath);
      if (req.user.avatar) {
        const oldAvatarPath = path.join(
          __dirname,
          "../uploads/avatars",
          req.user.avatar,
        );
        if (fs.existsSync(oldAvatarPath)) {
          fs.unlinkSync(oldAvatarPath);
        }
      }

      const avatarFileName = path.basename(optPqth);
      await User.update(
        { avatar: avatarFileName },
        { where: { id: req.user.id } },
      );
      const updateUser = await User.findByPk(req.user.id, {
        attributes: { exclude: ["password"] },
      });

      res.json({
        success: true,
        message: "Аватарка успешно загружена",
        user: {
          id: updateUser.id,
          name: updateUser.name,
          avatar: updateUser.avatar,
          avatarUrl: `/avatar/${updateUser.avatar}`,
        },
      });
    } catch (error) {
      next(error);
    }
  },
);

//localhost:3000/uploads/avatar/asklfajhsklf.jpg?a=111

router.get("/:filename", (req, res) => {
  try {
    const filename = req.params.filename;
    const cleanFilename = filename.split("?")[0];
    const filePath = path.join(__dirname, "../uploads/avatars", cleanFilename);
    console.log("Запрос аватарки:", filePath);
    if (fs.existsSync(filePath)) {
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.sendFile(filePath);
    } else {
      console.log("Файл не найден:", filePath);
      res.status(404).json({ error: "Аватарка не найдена" });
    }
  } catch (error) {
    console.error("Ошибка при получении аватарки", error);
    res.status(500).json({ error: "Ошибка при получении аватарки" });
  }
});

module.exports = router;
