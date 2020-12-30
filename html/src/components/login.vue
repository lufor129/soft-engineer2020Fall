<template>
  <div>
    <div class="login-wrap" v-show="showLogin">
      <img src="../assets/logo.png" />
      <p></p>
      <h3>會員登入</h3>
      <br />
      <p v-show="showTishi">{{ tishi }}</p>
      <input type="text" placeholder="輸入帳號" v-model="username" />
      <input
        type="password"
        placeholder="輸入密碼"
        maxlength="20"
        v-model="password"
        @keypress.enter="login"
      />
      <button v-on:click="login">登入</button>
      <span v-on:click="ToRegister">註冊</span>
    </div>

    <div class="register-wrap" v-show="showRegister">
      <img src="../assets/logo.png" />
      <p></p>
      <h3>註冊會員</h3>
      <br />
      <p v-show="showTishi">{{ tishi }}</p>
      <input type="text" placeholder="請輸入英文名字" v-model="newUserName" />
      <input type="text" placeholder="請輸入電子信箱" v-model="newUserEmail" />
      <input
        type="password"
        placeholder="請輸入1~20的英數混合字串"
        v-model="newPassword"
      />
      <button v-on:click="register">註冊</button>
      <span v-on:click="ToLogin">如果已有帳號，按此登入</span>
    </div>
  </div>
</template>

<style scoped>
.login-wrap {
  text-align: center;
  margin-top: 30px;
}
.register-wrap {
  text-align: center;
  margin-top: 30px;
}
.login-wrap input,
.register-wrap input {
  display: block;
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  margin-bottom: 20px;
  outline: none;
  border: 1px solid #888;
  padding: 10px;
  box-sizing: border-box;
}
p {
  color: red;
}
button {
  display: block;
  width: 250px;
  height: 40px;
  line-height: 40px;
  margin: 0 auto;
  border: none;
  background-color: #79ae75;
  color: #fff;
  font-size: 16px;
  margin-bottom: 10px;
}
span {
  cursor: pointer;
}
span:hover {
  color: #41b883;
}
</style>

<script>
import $ from "jquery";
import { setCookie, getCookie } from "../assets/js/cookie.js";

export default {
  data() {
    return {
      showLogin: true,
      showRegister: false,
      showTishi: false,
      tishi: "",
      userID: "",
      username: "",
      password: "",
      newUserEmail: "",
      newPassword: "",
      newUserName: "",
    };
  },
  mounted() {
    if (getCookie("username")) {
      this.$router.push("/home");
    }
  },
  methods: {
    ToRegister() {
      this.tishi = "";
      this.username = "";
      this.password = "";
      this.showRegister = true;
			this.showLogin = false;
    },
    ToLogin() {
      this.tishi = "";
      this.newUsername = "";
      this.newPassword = "";
      this.showRegister = false;
      this.showLogin = true;
    },
    register() {
      var regExp = /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/;
      if (
        this.newUserEmail == "" ||
        this.newPassword == "" ||
        this.newUserName == ""
      ) {
        alert("請確實填寫內容");
      } else if (!regExp.test(this.newUserEmail)) {
        alert("信箱格式錯誤");
        return;
      } else {
        let registerData = {
          account: this.newUserEmail,
          password: this.newPassword,
          name: this.newUserName,
        };
        this.$http.post(`${this.$host}/auth/register`, registerData).then((res) => {
          if (res.data == "success") {
            this.tishi = "註冊成功，請先至信箱收取驗證信";
            this.showTishi = true;
            this.newUserName = "";
            this.newUserEmail = "";
            this.newPassword = "";
            this.username = "";
            this.password = "";
            setTimeout(
              function () {
                this.showRegister = false;
                this.showLogin = true;
                this.showTishi = false;
              }.bind(this),
              10000
            );
          } else if (res.data == "emailExist") {
            this.tishi = "信箱已註冊過";
            this.showTishi = true;
            this.newUsername = "";
            this.newPassword = "";
          } else if (res.data == "databaseError") {
            this.tishi = "伺服器忙碌中，請稍後再試或聯絡資訊人員";
            this.showTishi = true;
            this.newUsername = "";
            this.newPassword = "";
          }
        });
      }
    },
    login() {
      if (this.username == "" || this.password == "") {
        alert("請輸入帳號或密碼");
      } else {
        let userData = { account: this.username, password: this.password };
        this.$http.post(`${this.$host}/auth/login`, userData).then((res) => {
          console.log(res.data);
          if (res.data == "wrong") {
            this.tishi = "密碼錯誤";
            this.showTishi = true;
            this.password = "";
          } else if (res.data == "admin") {
            this.tishi = "登入成功 ADMIN";
            this.showTishi = true;
            setCookie("username", this.username, 1000 * 60);
            setCookie("userIdentity", "admin", 1000 * 60);
            setTimeout(
              function () {
                this.$router.push("/home");
              }.bind(this),
              500
            );
          } else if (res.data == "success") {
            this.tishi = "登入成功";
            this.showTishi = true;
            setCookie("username", this.username, 1000 * 60);
            setCookie("userIdentity", "user", 1000 * 60);
            setTimeout(
              function () {
                this.$router.push("/home");
              }.bind(this),
              500
            );
          } else if (res.data == "unactivate") {
            this.tishi = "信箱尚未驗證，請先至信箱收取認證信";
            this.showTishi = true;
            this.username = "";
            this.password = "";
          } else {
            this.tishi = "帳號不存在，請先註冊";
            this.showTishi = true;
            this.password = "";
          }
        });
      }
    },
  },
};
</script>




          