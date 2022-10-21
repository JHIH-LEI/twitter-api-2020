const db = require("../models");
const bcrypt = require("bcrypt");
const { User } = db;

function turnToBoolean(data, attribute) {
  if (Array.isArray(data)) {
    data.forEach((data) => {
      if (data[`${attribute}`] === 1) {
        data[`${attribute}`] = true;
      } else data[`${attribute}`] = false;
    });
  } else {
    // 處理物件
    if (data[`${attribute}`] === 1) {
      data[`${attribute}`] = true;
    } else data[`${attribute}`] = false;
  }
}

async function loginValidation(account, password) {
  try {
    if (!account || !password) {
      return {
        status: "401",
        message: "所有欄位都是必填項",
        data: { account, password },
      };
    }
    const user = await User.findOne({ where: { account } });
    if (!user) {
      return {
        status: "401",
        message: "帳號不存在",
        data: { account, password },
      };
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return {
        status: "401",
        message: "密碼錯誤",
        data: { account, password },
      };
    }
    return { user: user.toJSON() };
  } catch (err) {
    console.warn(err);
    return { status: "500", message: err };
  }
}

module.exports = {
  turnToBoolean,
  loginValidation,
};
