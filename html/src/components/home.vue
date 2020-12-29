<template>
  <div>
    <div id="account">
      <h3>Hello！ {{ name }}</h3>
      <a v-if="nameIdentity == 'admin'" @click="toAdmins">後台管理</a
      >&ensp;&ensp;
      <a @click="quit">登出</a>
    </div>
    <div id="mainMean">
      <a style="text-align: center">你目前所訂閱的國家</a>
      <ul v-for="(countryName, index) in userCountrys" :key="index">
        <a @click="showCountry(countryName.country_name)"
          >▹<img
            style="width: 30px; height: 23px"
            :src="$imghost + countryName.flag_url"
          />&ensp;{{ countryName.country_name }}</a
        >
      </ul>
    </div>
    <h1 align="center"></h1>
    <br />
    <mapCovid
      v-on:transmitCountry="testCountryCall"
      v-on:changeMap="changeName"
      v-if="currentState"
    />
    <mapCovidUS
      v-on:transmitCountry="testCountryCall"
      v-on:changeMap="changeName"
      v-if="!currentState"
    />
    <div v-if="bulletinCountry != ''">
      <div id="grapOne">
        <div id="bulletin">
                      <img
              style="width: 30px; height: 23px ;margin-top:8px;"
              :src="$imghost + countryFlag"
            />{{ bulletinCountry }}
          <button style="float:right; margin-top:8px; margin-right:20px" @click="subscribeCountry()">訂閱</button>
           &ensp;
          <hr />
          <div
            :title="bulletin.b_time"
            style="border-radius: 18px; background-color: #e8fff5"
            id="bulletinContext"
            v-for="(bulletin, index) in bulletinContext.slice(
              pageStart,
              pageStart + countOfPage
            )"
            :key="index"
          @dblclick="deleteMessage(index)"
          >
            <img
              style="width: 40px; height: 40px; border-radius: 10px"
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfOusx-0nzTMaJMU3mQzh6aSbfWuHbwGhBw&usqp=CAU"
            />
            <a>{{ bulletin.name }}：{{ bulletin.message }}</a>
            <p></p>
          </div>
          <div id="pagination">
            <ul>
              <button
                v-bind:class="{ disabled: currPage === 1 }"
                @click.prevent="setPage(currPage - 1)"
              >
                ⇤
              </button>
              <li
                v-for="n in totalPage"
                :class="{ active: currPage === n }"
                @click.prevent="setPage(n)"
                :key="n"
              >
                <a>{{ n }}</a>&ensp;
              </li>
              <button
                v-bind:class="{ disabled: currPage === totalPage }"
                @click.prevent="setPage(currPage + 1)"
              >
                ⇥
              </button>
            </ul>
          </div>
          <input
          style="width:400px; height:20px; text-align: center;"
            placeholder="說話啊！"
            v-model="newMessages"
            @keypress.enter="newMessage()"
          />
        </div>
      </div>
      <div id="grapPosition">
        &ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;&ensp;
        <grapPie></grapPie>
      </div>
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <div>
        <grapLine></grapLine>
      </div>
    </div>
  </div>
</template>

<script>
import { setCookie, getCookie, delCookie } from "../assets/js/cookie.js";
import grapLine from "./line.vue";
import grapPie from "./pie";
import mapCovid from "./map.vue";
import mapCovidUS from "./US_map.vue";
import { timeout } from "q";
export default {
  components: {
    grapLine,
    grapPie,
    mapCovid,
    mapCovidUS,
  },
  data() {
    return {
      name: "",
      userComputers: "",
      userComputerList: "",
      active: 0,
      currentState: false,
      userCountrys: "",
      bulletinCountry: "",
      bulletinContext: "",
      countOfPage: 4,
      currPage: 1,
      newMessages: "",
      countryFlag:''
    };
  },
  computed: {
    pageStart: function () {
      return (this.currPage - 1) * this.countOfPage;
    },
    totalPage: function () {
      return Math.ceil(this.bulletinContext.length / this.countOfPage);
    },
  },
  created() {
    let testName = "admin";
    let uname = getCookie("username");
    let userIdentity = getCookie("userIdentity");
    let userAccount = { account: uname };
    this.name = uname;
    this.nameIdentity = userIdentity;
    let getUserCountryApi = `${this.$host}/country/getUserCountry?account=${testName}`;
    this.$http.get(getUserCountryApi).then((res) => {
      this.userCountrys = res.data.data;
    });
  },
  mounted() {
    if(this.name == ""){
                this.$router.push('/')
            };
  },
  methods: {
    quit() {
      delCookie("username");
      delCookie("userIdentity");
      this.$router.push("/");
    },
    toAdmins() {
      this.$router.push("/admin");
    },
    testCountryCall(country) {
      console.log(country);
    },
    changeName(forTest) {
      this.currentState = forTest;
    },
    showCountry(countryName) {
      this.bulletinCountry = countryName;
      let getApi = `${this.$host}/bulletin/getBulletin?country=${countryName}`;
      this.$http.get(getApi).then((res) => {
        this.bulletinContext = res.data.data;
        this.countryFlag=res.data.country.flag_url;
      });
    },
    newMessage() {
      let postData = {
        name: this.name,
        account: "admin",
        country_name: this.bulletinCountry,
        message: this.newMessages,
        b_time:new Date().toLocaleString()
      };
      let postAPI=`${this.$host}/bulletin/addBulletin`
      this.$http.post(postAPI,JSON.stringify(postData)).then((res)=>{
              this.bulletinContext.push(postData)
              this.newMessages=''
           });
    },
    setPage: function (idx) {
      if (idx <= 0 || idx > this.totalPage) {
        return;
      }
      this.currPage = idx;
    },
    subscribeCountry() {
      let postData = {
        account: "admin",
        country_name: this.bulletinCountry,
      };
      let postAPI = `${this.$host}/country/subscribeCountry`;
      this.$http.post(postAPI, JSON.stringify(postData)).then((res) => {
        console.log(res.data);
      });
    },
    deleteMessage(index){
      let postData = {
        account: "admin",
        country_name: this.bulletinContext[index].country_name,
        b_time:this.bulletinContext[index].b_time
      };
      if(this.nameIdentity=='admin'){
        let postAPI = `${this.$host}/bulletin/deleteBulletin`;
        this.$http.delete(postAPI, JSON.stringify(postData)).then((res) => {
          console.log(res.data);
      });
      }  
    }
  },
};
</script>
<style>
#account {
  text-align: center;
  position: absolute;
  top: 30px;
  right: 1%;
}
#mainMean {
  background-color: #94c5b5;
  max-height: auto;
  min-height: 65%;
  width: 20%;
  position: absolute;
  top: auto;
}

#homeInfo {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  font-size: 12pt;
  text-align: center;
  position: absolute;
  top: auto;
  left: 23%;
}
#homeInfo td {
  display: inline;
}
#mainMean a {
  border-top: 2px solid rgba(255, 255, 255, 0.08);
  display: block;
  padding: 2em 1.5em;
  text-align: left;
  text-decoration: none;
  font-weight: 700;
  color: #fafafa;
}
#mainMean li {
  margin-left: 5%;
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

#homeInfo tr:nth-child(1) {
  background-color: #64906e;
  color: white;
}
.active {
  color:white;
}

td {
  color: #2c3e50;
}
button{
  margin: 0 auto;
  border: none;
  background-color: #79ae75;
  color: #fff;
  font-size: 16px;
}
#bulletin {
  background-color: #b3d9d9;
  min-width: 550px;
  border-radius: 10px;
  height: 105%;
}
#bulletinContext {
  text-align: left;
}
#grapOne {
  display: flex;
  position: absolute;
  left: 20%;
  height: 45%;
}
#grapPosition {
  position: absolute;
  left: 63%;
  text-align: left;
}
#pagination ul li {
  display: inline;
}
</style>