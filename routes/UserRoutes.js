const express = require('express');
const CreateUser = require('../controller/users/CreateUser');
const UpdateUser = require('../controller/users/UpdateUser');
const router = express.Router();

router.post('/user/add', CreateUser);
router.put('/user/update', UpdateUser);


module.exports = router;
