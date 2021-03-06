const express = require("express");
const router = express.Router();
const Sequelize = require("sequelize");
const Op = Sequelize.Op;
const Transfer = require("../services/transfer");
const AccountInfo = require("../services/accountInfo");
const User = require("../services/user");

router.get("/:id", async (req, res) => {
  if (!req.currentUser) return res.redirect("/login");
  if (
    req.currentUser &&
    !req.currentUser.email &&
    req.currentUser.permisstion == 0
  )
    return res.redirect("/add-mail");

  if (
    req.currentUser &&
    req.currentUser.token &&
    req.currentUser.permisstion == 0
  )
    return res.redirect("/active");

  if (req.currentUser.isActive == 5) return res.redirect("/alert/blocked");
  const { id } = req.params;
  // thông tin chueyẻn khảon
  const htrTransfer = await Transfer.findAll({
    where: {
      [Op.or]: {
        fromUser: {
          [Op.eq]: id,
        },
        toUser: {
          [Op.eq]: id,
        },
      },
    },
  }); // lấy lịch sử giao dịch. 1 người có thể giao dịch nhiều lần nên phải tìm tất cả

  // thong tin tai khoan
  const accountInfo = await AccountInfo.findOne({
    where: {
      userID: id,
    },
  });
  // console.log(accountInfo)
  // if(!accountInfo){
  //     res.redirect('/error');
  // }
  //thông tin cá nhân

  const userInfo = await User.findByID(id);

  if (htrTransfer) {
    return res.render("showTransferHistory", {
      accountInfo,
      htrTransfer,
      id: userInfo.id,
      displayName: userInfo.displayName,
    });
  }

  return res.end("loi gi ko biet");
});

module.exports = router;

const rsUser = null;
