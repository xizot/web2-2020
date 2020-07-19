const express = require('express');
const router = express.Router();
const { sendRequest } = require('../services/userRequest');


router.get('/', async (req, res) => {

    if (!req.currentUser) return res.redirect('/login')
    if (req.currentUser && !req.currentUser.email && req.currentUser.permisstion == 0) return res.redirect('/add-mail');

    if (req.currentUser && req.currentUser.token && req.currentUser.permisstion == 0) return res.redirect('/active');


    const id = req.currentUser.id || null;
    if (!req.currentUser) return null;

    const rs = await sendRequest(req.currentUser.id, 3);
    if (rs) {
        return res.render('alert/alert', { title: 'Payyed - Create Credit', msg: 'Đã gửi yêu cầu tạo tài khoản tiết kiệm thành công. Nhân viên sẽ phản hồi lại sau <a href="/">Ấn vào đây để quay lại</a>' });
    }

    return res.render('alert/alert', { title: 'Payyed - Create Credit', msg: 'Đã xảy ra lỗi <a href="/">Ấn vào đây để quay lại</a>' });
})



module.exports = router;