<template>
  <div>
    <div id="account">
      <h3>Hello！ {{ name }}</h3>
      <a @click="quit">登出</a>
    </div>
    <div id="mainMean">
      <a @click="caseManger">案例管理</a>
      <a @click="userManger">使用者管理</a>
    </div>
    <h1 align="center">{{ adminManger }}</h1>
    <div v-if="caseShow" id="caseManger">
       <a @click="switchCaseCountry()">🔄</a>
      <div id="addCase">
        <img src="../assets/addIcon.png" @click="addCase = !addCase" />
        新增案例<br />
        <transition name="slide-fade">
          <input v-if="addCase" placeholder="時間" v-model="caseTime" />
        </transition>
        <transition name="slide-fade">
          <input v-if="addCase&&switchCaseCountrys" placeholder="國家名稱" v-model="caseCountry" />
          <input v-if="addCase&&!switchCaseCountrys" placeholder="州郡名稱" v-model="caseState" />
        </transition>
        <transition name="slide-fade">
          <input v-if="addCase" placeholder="恢復人數" v-model="caseRecover" />
        </transition>
        <transition name="slide-fade">
          <input v-if="addCase" placeholder="死亡人數" v-model="caseDead" />
        </transition>
        <transition name="slide-fade">
          <input v-if="addCase" placeholder="確診人數" v-model="caseSick" />
        </transition>
        <transition name="slide-fade">
          <img v-if="addCase" src="../assets/finish.png" @click="addCaseData" />
        </transition>
      </div>
      <div id="caseSearch">
          <input
          v-model="countryFilter"
          type="text"
          class="right border"
          placeholder="國家"
        />
        <img src="../assets/search.png"                 
          width="20"
          height="20"> 
      </div>
      <div id="caseView">
        <table>
          <tr>
            <th>國家</th>
            <th>恢復人數</th>
            <th>確診人數</th>
            <th>死亡人數</th>
            <th>時間</th>
            <th>
              &ensp;<img
                @click="editCaseShow = !editCaseShow"
                src="../assets/editIcon.png"
                width="20"
                height="20"
              />&ensp; &ensp;<img
                @click="deleteCaseShow = !deleteCaseShow"
                src="../assets/delete.png"
                width="20"
                height="20"
              />&ensp;
            </th>
          </tr>
          <tr :key="caseData" v-for="(caseData, index) in filteredCaseRows">
            <th>{{ caseData.countryName }}</th>
            <th>
              <input
                v-if="index == editItem"
                :placeholder="caseData.recover"
                type="number"
                v-model="editCaseR"
              />
              <a v-else>{{ caseData.recover }}</a>
            </th>
            <th>
              <input
                v-if="index == editItem"
                :placeholder="caseData.sick"
                type="number"
                v-model="editCaseS"
              />
              <a v-else>{{ caseData.sick }}</a>
            </th>
            <th>
              <input
                v-if="index == editItem"
                :placeholder="caseData.dead"
                type="number"
                v-model="editCaseD"
              />
              <a v-else>{{ caseData.dead }}</a>
            </th>
            <th>{{ caseData.time }}</th>
            <th>
              <img
                v-if="index == editItem"
                src="../assets/finish.png"
                @click="editCaseFinish(index)"
              />
              <img
                v-if="editCaseShow"
                @click="editCase(index)"
                src="../assets/editIcon.png"
                width="20"
                height="20"
              />
              <img
                v-if="deleteCaseShow"
                @click="deleteCase(index)"
                src="../assets/cut.png"
                width="20"
                height="20"
              />
            </th>
          </tr>
        </table>
      </div>
    </div>
    <div v-if="userShow" id="userManger">
      <br />
      <div id="userSerach">
        <input placeholder="信箱" v-model="emailFilter" />
        <input placeholder="姓名" v-model="nameFilter" />
        <select v-model="userIdentityFilter">
          <option value="">ALL</option>
          <option value="user">會員</option>
          <option value="admin">管理員</option>
        </select>
      </div>
      <div id="userView">
        <table>
          <tr>
            <th>信箱</th>
            <th>姓名</th>
            <th>身份</th>
            <th>
              &ensp;<img
                @click="deleteUserShow = !deleteUserShow"
                src="../assets/delete.png"
                width="20"
                height="20"
              />&ensp;
            </th>
          </tr>
          <tr :key="userData" v-for="(userData, index) in filteredUserRows">
            <input
              v-if="userData.account == editUserEmail"
              :placeholder="userData.email"
              v-model="newEmail"
              type="text"
              @keypress.enter="leftEditEmail(index)"
            />
            <th v-else @click="intoEditEmail(userData.accunt)">
              {{ userData.account }}
            </th>
            <input
              v-if="index === editUserName"
              :placeholder="userData.name"
              v-model="newName"
              type="text"
              @keypress.enter="leftEditName(index)"
            />
            <th v-else @click="intoEditName(index)">{{ userData.name }}</th>
            <th>
              <!--不能v-model 因為每列不一樣 and onchange不會觸發-->
              <select @onchange="editUserIdentity()">
                <option selected :value="userData.useridentify">
                  {{ userData.useridentify }}
                </option>
                <option v-if="userData.useridentify != 'user'" value="user">
                  user
                </option>
                <option v-if="userData.useridentify == 'user'" value="admin">
                  admin
                </option>
              </select>
            </th>
            <th>
              <img
                v-if="deleteUserShow"
                @click="deleteUser(userData.account, index)"
                src="../assets/cut.png"
                width="20"
                height="20"
              />
            </th>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>


<script>
import { setCookie, getCookie, delCookie } from "../assets/js/cookie.js";
export default {
  data() {
    return {
      name: "",
      adminManger: "案例管理",
      caseTime: "",
      caseCountry: "",
      caseRecover: "",
      caseDead: "",
      caseSick: "",
      addCase: false,
      caseShow: true,
      editCaseShow: false,
      deleteCaseShow: false,
      deleteUserShow: false,
      userShow: "",
      allCaseData: "",
      allUserData: "",
      editUserEmail: "",
      editUserName: "",
      newName: "",
      newEmail: "",
      emailFilter: "",
      nameFilter: "",
      userIdentityFilter: "",
      countryFilter: "",
      editItem: -1,
      editUserIdentity: "",
      editCaseR: "",
      editCaseS: "",
      editCaseD: "",
      switchCaseCountrys:true,
      caseState:''
    };
  },
  created() {
    let uname = getCookie("username");
    let userIdentity = getCookie("userIdentity");
    let userAccount = { account: uname };
    this.name = uname;
    this.nameIdentity = userIdentity;
    this.getAllCaseData();
    this.getAllUserData();
  },
  mounted() {
    if (this.name == "") {
      this.$router.push("/");
    }
  },
  methods: {
    quit() {
      delCookie("username");
      delCookie("userIdentity");
      this.$router.push("/");
    },
    caseManger() {
      this.adminManger = "案例管理";
      this.userShow = false;
      this.caseShow = true;
    },
    userManger() {
      this.adminManger = "使用者管理";
      this.userShow = true;
      this.caseShow = false;
    },
    intoEditEmail(editEmail) {
      this.editUserEmail = editEmail;
    },
    leftEditEmail(userIndex) {
      this.editUserEmail = "";
      if (this.newEmail != "") {
        this.updateUserEmail(
          this.newEmail,
          this.allUserData[userIndex].email,
          userIndex
        );
      }
      /* else{
                  alert("不要亂點^_^")
                }*/
    },
    intoEditName(editName) {
      this.editUserName = editName;
    },
    leftEditName(userIndex) {
      this.editUserName = "";
      if (this.newName != "") {
        this.updateUserName(
          this.newName,
          this.allUserData[userIndex].email,
          userIndex
        );
      }
    },
    addCaseData() {
      if (
        this.caseTime == "" ||
        this.caseCountry == "" ||
        this.caseRecover == "" ||
        this.caseDead == "" ||
        this.caseSick == ""
      ) {
        alert("請填入新增資料，無請補零");
      } else {
        let addCaseData = {
          addCaseCountry: this.caseCountry,
          addCaseRecover: this.caseRecover,
          addCaseSick: this.caseSick,
          addCaseDead: this.caseDead,
          addCaseTime: this.caseTime,
        };
        this.$http.post("/addCase", JSON.stringify(addCaseData)).then((res) => {
          if (res.body === "success") {
            alert("good");
            this.caseTime = "";
            this.caseCountry = "";
            this.caseRecover = "";
            this.caseDead = "";
            this.caseSick = "";
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
      }
    },
    getAllUserData() {
      this.$http.get(`${this.$host}/auth/getAllUserData`).then((res) => {
        if (res.data.success) {
          this.allUserData = res.data.user;
        } else {
          alert(res.data.message);
        }
      });
    },
    getAllCaseData() {
      this.$http.get(`${this.$host}/S_covid/getAllCaseData`).then((res) => {
        if (res.data == "error") {
          alert("抓取資料庫資料錯誤");
        } else {
          this.allCaseData = res.data;
        }
      });
    },
    //api未串
    updateUserEmail(newEmail, userEmail, index) {
      let postData = {
        newEmail: newEmail,
        userEmail: userEmail,
      };
      this.$http
        .post(`${this.$host}/updateUserEmail`, JSON.stringify(postData))
        .then((res) => {
          if (res.body === "success") {
            this.filteredUserRows[index].email = newEmail;
            this.newEmail = "";
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
    },
    updateUserName(newName, userEmail, index) {
      let postData = {
        newName: newName,
        userEmail: userEmail,
      };
      this.$http
        .post("/updateUserName", JSON.stringify(postData))
        .then((res) => {
          if (res.body === "success") {
            this.filteredUserRows[index].name = newName;
            this.newName = "";
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
    },
    deleteUser(userEmail, index) {
      if (confirm("確定要刪除" + userEmail + "這筆資料嗎?")) {
        let postData = {
          account: userEmail,
        };
        this.$http.post(`${this.$host}/auth/deleteUser`, postData).then((res) => {
          if (res.body === "success") {
            this.filteredUserRows.splice(index);
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
      }
    },
    deleteCase(CaseIndex) {
      if (confirm("確定要刪除這筆資料嗎?")) {
        let postData = {
          deleteCaseCountry: this.filteredCaseRows[CaseIndex].countryName,
          deleteCaseTime: this.filteredCaseRows[CaseIndex].time,
        };
        this.$http.post("/deleteCase", JSON.stringify(postData)).then((res) => {
          if (res.body === "success") {
            this.filteredCaseRows.splice(CaseIndex);
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
      }
    },
    editCase(editItem) {
      this.editItem = this.editItem == editItem ? -1 : editItem;
    },
    editCaseFinish(CaseIndex) {
      if (
        this.editCaseR == "" ||
        this.editCaseS == "" ||
        this.editCaseD == ""
      ) {
        alert("請不要留下空白欄位");
      } else {
        let postData = {
          editCaseCountry: this.filteredCaseRows[CaseIndex].countryName,
          editCaseTime: this.filteredCaseRows[CaseIndex].time,
          editCaseR: this.editCaseR,
          editCaseS: this.editCaseS,
          editCaseD: this.editCaseD,
        };
        this.$http.post("/editCase", JSON.stringify(postData)).then((res) => {
          if (res.body === "success") {
            this.filteredCaseRows[CaseIndex].recover = this.editCaseR;
            this.filteredCaseRows[CaseIndex].sick = this.editCaseS;
            this.filteredCaseRows[CaseIndex].dead = this.editCaseD;
            this.editCaseR = "";
            this.editCaseS = "";
            this.editCaseD = "";
            this.editItem = -1;
          } else {
            alert("資料庫錯誤，請稍後再試");
          }
        });
      }
    },
    switchCaseCountry(){
      this.switchCaseCountrys=!this.switchCaseCountrys;
      console.log(this.switchCaseCountrys);
    }
  },
  computed: {
    selectAll: {
      get() {
        return this.userComputers
          ? this.checkComputers.length === this.userComputers.length
          : false;
      },
      set(value) {
        let selected = [];
        if (value) {
          this.userComputers.forEach((action) => {
            selected.push(action.computerName + "," + action.hostId);
          });
        }
        this.checkComputers = selected;
      },
    },
    filteredUserRows: function () {
      var emailFilter = this.emailFilter;
      var nameFilter = this.nameFilter;
      var userIdentityFilter = this.userIdentityFilter;
      return this.emailFilter == "" &&
        this.nameFilter == "" &&
        this.userIdentityFilter == ""
        ? this.allUserData
        : this.allUserData.filter(function (d) {
            return (
              d.name.indexOf(nameFilter) > -1 &&
              d.account.indexOf(emailFilter) > -1 &&
              d.useridentify.indexOf(userIdentityFilter) > -1
            );
          });
    },
    filteredCaseRows: function () {
      var countryFilter = this.countryFilter.toLowerCase();
      return this.countryFilter == ""
        ? this.allCaseData
        : this.allCaseData.filter(function (d) {
            return d.countryName.toLowerCase().indexOf(countryFilter) > -1;
          });
    }
  },
};
</script>

<style>
#mainMean {
  background-color: #94c5b5;
  max-height: auto;
  min-height: 65%;
  width: 20%;
  position: absolute;
  top: auto;
}
#mainMean a {
  border-top: 2px solid rgba(255, 255, 255, 0.08);
  display: block;
  padding: 2em 1.5em;
  text-align: left;
  text-decoration: none;
  font-weight: 700;
  color: #fafafa;
  margin-left: 15%;
}
#mainMean li {
    margin-left: 20%;

}
table {
  border-collapse: collapse;
  width: 100%;
  line-height: 30px;
}

th,
td {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  text-align: center;
  padding: 10px;
}
#account {
  text-align: center;
  position: absolute;
  top: 30px;
  right: 1%;
}
#caseManger,
#userManger {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 13pt;
  text-align: left;
  position: absolute;
  top: auto;
  left: 23%;
  display: inline-block;
  flex-wrap: nowrap;
}


#caseManger input {
  width: auto;
  height: auto;
  margin: 1px;
}

#caseManger button {
  margin-left: 3em;
  margin-top: 4em;
}

#caseSearch,
#userSerach {
  width: 100%;
  height: auto;
}

/*設定淡入淡出動畫
*/
.slide-fade-enter-active {
  transition: all 0.5s ease;
}

.slide-fade-leave-active {
  transition: all 0.7s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateX(10px);
  opacity: 0;
}
</style>