<template>
<div>
    <div id="account"> 
        <h3>Hello！ {{name}}</h3>
        <a v-if="nameIdentity=='admin'" @click="toAdmins">後台管理</a>&ensp;&ensp;
        <a  @click="quit">登出</a>
    </div>
    <div id="mainMean">
        <a style="text-align:center;">你目前所訂閱的國家</a>
        <ul v-for="(countryName,index) in userCountrys" :key="index" >
            <a :class="{active: active===index+1}" @click="scrollTo(index+1)">
                <a @click="showCountry(countryName.country_name)" >▹<img style="width:30px;height:23px; " :src="'http://140.127.220.185:9000'+countryName.flag_url">&ensp;{{countryName.country_name}}</a>
            </a>
        </ul>
	</div>
        <!-- <label for="toggle_button">
      <span v-if="currentState" class="toggle__label">On</span>
      <span v-if="!currentState" class="toggle__label">Off</span>

      <input type="checkbox" id="toggle_button" v-model="currentState">
    </label> -->
    <h1 align="center"></h1>
        <br>
    
    <div class="content" v-on:changeMap="changeName"> 
        <mapCovid v-on:transmitCountry="testCountryCall" v-on:changeMap="changeName" v-if="currentState"/>
        <mapCovidUS v-on:transmitCountry="testCountryCall" v-on:changeMap="changeName" v-if="!currentState"/>
        </div>
    <div v-if="bulletinCountry!=''" id="bulletin">
        {{bulletinCountry}}
        <hr>
        <div id="bulletinContext" v-for="(bulletin,index) in bulletinContext" :key="index">
           {{bulletin.message}}：{{bulletin.name}}
            <img style="width:40px;height:40px; border-radius:10px;" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQkfOusx-0nzTMaJMU3mQzh6aSbfWuHbwGhBw&usqp=CAU">
        </div>
    </div>
     
    <div id="Grap" class="content" >
        <grapLine></grapLine><grapPie></grapPie>
    </div>
    
</div>

</template>

<script>
import { setCookie,getCookie,delCookie } from '../assets/js/cookie.js'
import grapLine from './line.vue';
import grapPie from './pie';
import mapCovid from './map.vue'
import mapCovidUS from './US_map.vue'
import { timeout } from 'q'
    export default{
          components:{
            grapLine,
            grapPie,
            mapCovid,
            mapCovidUS,
        },
        data(){
            return{
                name: '',
                userComputers:'',
                userComputerList:'',
                active: 0,
                currentState: false,
                userCountrys:'',
                bulletinCountry:'',
                bulletinContext:''
            }
        },
        created() {
            let testName='admin'
            let uname = getCookie('username')
            let userIdentity = getCookie('userIdentity')
            let userAccount = {'account':uname}
            this.name = uname
            this.nameIdentity=userIdentity
            //this.userCountrys=this.getUserCountry(uname);
            let getUserCountryApi=`${this.$host}/country/getUserCountry?account=${testName}`;
                this.$http.get(getUserCountryApi).then((res)=>{
                    this.userCountrys=res.data.data;
             });
        },
        mounted(){
            window.addEventListener('scroll', this.onScroll, false)
           /* if(this.name == ""){
                this.$router.push('/')
            };*/
        },
        methods:{
            quit(){
                delCookie('username')
                delCookie('userIdentity')
                 this.$router.push('/')
            },
            toAdmins(){
                this.$router.push('/admin')
            },
            onScroll() {
                const navContents = document.querySelectorAll('.content div');
                const offsetTopArr = [];
                navContents.forEach(item => {
                    offsetTopArr.push(item.offsetTop)
                });
                const scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                let navIndex = 0
                for (let n = 0; n < offsetTopArr.length; n++) {
                    if (scrollTop >= offsetTopArr[n]) {
                        navIndex = n
                    }
                }
                this.active = navIndex
            },
            scrollTo(index) {
                const targetOffsetTop = document.querySelector(`.content div:nth-child(${index + 1})`).offsetTop
                let scrollTop = document.documentElement.scrollTop || document.body.scrollTop
                const step = 50
                if (scrollTop > targetOffsetTop) {
                    smoothUp()
                } 
                else {
                    smoothDown()
                }
                function smoothDown() {
                    if (scrollTop < targetOffsetTop) {
                        if (targetOffsetTop - scrollTop >= step) {
                            scrollTop += step
                        } 
                        else {
                            scrollTop = targetOffsetTop
                        }
                        document.body.scrollTop = scrollTop
                        document.documentElement.scrollTop = scrollTop
                        requestAnimationFrame(smoothDown)
                    }
                }
                function smoothUp() {
                    if (scrollTop > targetOffsetTop) {
                        if (scrollTop - targetOffsetTop >= step) {
                            scrollTop -= step
                        }
                        else {
                            scrollTop = targetOffsetTop
                        }
                        document.body.scrollTop = scrollTop
                        document.documentElement.scrollTop = scrollTop
                        requestAnimationFrame(smoothUp)
                    }
                }
            },
            testCountryCall(country){
                console.log(country)
            },
            changeName(forTest){
                this.currentState = forTest
            },
            showCountry(countryName){
                this. bulletinCountry=countryName;
                let getApi=`${this.$host}/bulletin/getbulletin?country=${countryName}`;
                this.$http.get(getApi).then((res)=>{
                    this.bulletinContext=res.data.data;
             });
            }
        },
        destroy() {
            window.removeEventListener('scroll', this.onScroll)
        }
    }
</script>
<style>
#account {
    text-align:center;
    position: absolute;
    top:30px;
    right: 1%;
}
#mainMean {
    background-color: #94c5b5;
    max-height:auto;
    min-height:65%;
    width: 20%;
    position: absolute;
    top:auto;
}

#homeInfo{
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    font-size: 12pt;
    text-align:center;
    position: absolute;
    top:auto;
    left:23%;
}
#homeInfo td{
	display:inline;
}
#mainMean  a{   
    border-top: 2px solid rgba(255,255,255,0.08);
	display: block;
	padding: 2em 1.5em;
    text-align: left;
    text-decoration:  none;
	font-weight: 700;
    color:#FAFAFA;
}
#mainMean  li{
    margin-left: 5%;
}
table {
  border-collapse: collapse;
  width: 100%;
  line-height:30px;
}

th, td {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    text-align: center;
    padding: 10px;
    
}

/* #homeInfo tr:nth-child(1) {
  background-color: #64906e;
  color: white;
} */

td{
color: #2c3e50;
}
#bulletin{
    background-color:#B3D9D9;
}  
#bulletinContext{
     text-align: right;
}

</style>