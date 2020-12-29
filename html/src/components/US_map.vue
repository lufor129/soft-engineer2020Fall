<template>
    <div>
        <div>
            <span>開始</span>
            <input id="date" value="2020-02-03" v-model="start" type="date">
            <span>結束</span>
            <input id="date" value="2020-02-04" v-model="end" type="date">
            <button @click="getCovidData">確認</button>
        </div>
        <div id="wrap">
            <div class="wrapper">
                <input type="range" min=0 :max="worldCovid==null?2:worldCovid.date.length-1" step="1" v-model="value" > 
                <input type="number" v-model="value"/>
            </div>
            <select v-model="dataStyle">
                <option selected value="confirmed">確診</option>
                <option value="deaths">死亡</option>
            </select>
        </div>
        <div style="position: relative;left:20%;width: auto;background-color:#007979; border-radius:10px;">
            <div id="mapTab">
                <div @click="switchCountryName(true)" style="background-color:#5CADAD;border-radius:6px 6px 0px 0px;" >世界地圖</div>
                <div @click="switchCountryName(false)" style="background-color:#FFFFFF; border-radius:6px 6px 0px 0px;" >US地圖</div>
                <br>
            </div>
            <br>
            <div class="google-map" id="map_us"/>
            <br>
        </div>
    </div>
</template>


<script>
const StyleColor = {
    "confirmed": ["8E0E00","1f1c18"],
    "deaths":["485563","29323c"]
}

const CovidMinMax = {
    "confirmed":[10,850000],
    "deaths":[10,20000]
}
export default {
    name:"Map",
    data() {
        return {
            map:null,
            infoWindow:null,
            GeoclickCountry:null,
            value:0,
            dataStyle:"confirmed",
            start:"2020-02-03",
            end:"2020-06-06",
            countrys:null,
            worldCovid:null,
        }
    },
    mounted(){
        this.initMap()
    },
    methods:{
        initMap(){
            let vm = this
            this.map = new google.maps.Map(document.getElementById("map_us"),{
                center:{lat:38,lng:-100},
                zoom:4,
                maxZoom:6,
                minZoom:2,
                streetViewControl: false,
                mapTypeControl: false

            });
            this.map.data.loadGeoJson("https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json")

            this.infoWindow = new google.maps.InfoWindow()
            
            this.map.data.setStyle(function(feature){
                return {
                    fillColor:'white',
                    strokeWe46ight:1
                }
            });
            const api = `${this.$host}/state/getAllStates`
            this.$http.get(api).then(response => {
                vm.countrys = response.data.country
                vm.map.data.addListener("click",function(event){
                    let cooridinate = {lat:event.latLng.lat(),lng:event.latLng.lng()};
                    vm.GeoclickCountry = event.feature.getProperty("name")
                    vm.makeInfoWindow(vm.GeoclickCountry)
                    vm.infoWindow.setPosition(cooridinate);
                    vm.infoWindow.open(vm.map)
                    let countryData = vm.countrys.filter(element=>{
                        return element["geo"] == vm.GeoclickCountry
                    })[0];
                    vm.$emit("transmitCountry",countryData.state_name)
                })
            });

            this.map.data.addListener('mouseover', function(event) {
                // console.log(event.feature.getProperty("name"))
                // this.map.data.revertStyle(event.feature);
                this.map.data.overrideStyle(event.feature, {strokeWeight: 8});
            });

            this.map.data.addListener('mouseout', function(event) {
                // this.countryFeature = event.feature
                // this.map.data.revertStyle();
                this.map.data.overrideStyle(event.feature,{strokeWeight:1});
            });
        },
        changeBar(feature,color,percent){
            // this.map.data.revertStyle(feature)
            this.map.data.overrideStyle(feature,{fillColor:color,fillOpacity:0.35+percent*120})
        },
        printDate(Date){
            let year = Date.getFullYear();
            let mon = Date.getMonth()+1;
            let d = Date.getDate();
            return `${year}-${mon}-${d}`
        },
        makeInfoWindow(GeoName){
            let countryData = this.countrys.filter(element=>{
                return element["geo"] == GeoName
            })[0];
            let covid_data = this.worldCovid.covid[this.value].filter(country=>{
                return country["state_name"] == countryData.state_name
            })[0];
            this.infoWindow.setContent(this.infoContent(covid_data,countryData))
        },
        getCovidData(){
            this.value = 0;
            let api = `${this.$host}/S_covid/all_state?start=${this.start}&end=${this.end}&flag=true`
            this.$http.get(api).then(response=>{
                console.log(response.data)
                this.worldCovid = response.data.data
            });
        },
        caculatePercent(num){
            let range = CovidMinMax[this.dataStyle]
            let percent = (num-range[0])/(range[1]-range[0])
            return percent
        },
        caculateColor(percent){
            let colorRange = StyleColor[this.dataStyle]
            // colorRange = colorRange.map(element=>{
            //     return parseInt(element,16)
            // })
            // let percent = (num-range[0])/(range[1]-range[0])
            return this.gradientColor(colorRange[0],colorRange[1],percent)
        },
        gradientColor(start_color, end_color, percent){
            if(percent>1.3) percent=1.3
            // strip the leading # if it's there
            start_color = start_color.replace(/^\s*#|\s*$/g, '');
            end_color = end_color.replace(/^\s*#|\s*$/g, '');

            // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
            if(start_color.length == 3){
                start_color = start_color.replace(/(.)/g, '$1$1');
            }
            if(end_color.length == 3){
                end_color = end_color.replace(/(.)/g, '$1$1');
            }

            // get colors
            var start_red = parseInt(start_color.substr(0, 2), 16),
                start_green = parseInt(start_color.substr(2, 2), 16),
                start_blue = parseInt(start_color.substr(4, 2), 16);

            var end_red = parseInt(end_color.substr(0, 2), 16),
                end_green = parseInt(end_color.substr(2, 2), 16),
                end_blue = parseInt(end_color.substr(4, 2), 16);

            // calculate new color
            var diff_red = end_red - start_red;
            var diff_green = end_green - start_green;
            var diff_blue = end_blue - start_blue;

            diff_red = ( (diff_red * percent) + start_red ).toString(16).split('.')[0];
            diff_green = ( (diff_green * percent) + start_green ).toString(16).split('.')[0];
            diff_blue = ( (diff_blue * percent) + start_blue ).toString(16).split('.')[0];

            // ensure 2 digits by color
            if( diff_red.length == 1 ) diff_red = '0' + diff_red
            if( diff_green.length == 1 ) diff_green = '0' + diff_green
            if( diff_blue.length == 1 ) diff_blue = '0' + diff_blue

            return '#' + diff_red + diff_green + diff_blue;
        },
        infoContent(covid_data,countryData){
            let c_date = this.worldCovid.date[this.value]
            if(covid_data == undefined){
                covid_data = {
                    "confirmed":0,
                    "deaths":0,
                    "recovered":0,
                }
            }
            let infoHTML = `
            <style>
                @import url("https://fonts.googleapis.com/css?family=Roboto:400,400i,700");
                h2{
                    margin:0.1rem;
                }
                .card img{
                    width:250px;
                    height:140px;
                }
                .date{
                    font-size: medium;
                }
                .card .actions button {
                    padding: 0.3rem 0.5rem;
                    cursor: pointer;
                    background-color: transparent;
                    border: none;
                    text-transform: uppercase;
                    outline: 0;
                    transition: background-color 0.4s, color 0.4s, transform 0.1s;
                }
                .card .actions button:hover {
                    color: white;
                    box-shadow: 0 0 24px rgba(0, 0, 0, .2);
                }
                .card .actions button:active {
                    transform: scale(0.95);
                    box-shadow: 0 0 16px rgba(0, 0, 0, .3);
                }
                .card .actions__like:hover {
                    background-color: #00b16a;
                }
                .card .actions__trade:hover {
                    background-color: #3498db;
                }
                .card .actions__cancel:hover {
                    background-color: #c0392b;
                }
            </style>
            <div class="card">
                <h2>${countryData.state_name}</h2>
                <div class="date">${this.printDate(new Date(c_date))}</div>
                <img src="${this.$imghost}${countryData.flag_url}" alt="">
                <div class="actions">
                    <button class="actions__like">${covid_data.confirmed} &nbsp; <i class="fas fa-biohazard"></i></button>
                    <button class="actions__cancel">${covid_data.deaths} &nbsp; <i class="fas fa-skull-crossbones"></i> </button>
                </div>
            </div>
            `
            return infoHTML
        },
        renderMapColor(){
            this.map.data.revertStyle()
            let vm = this
            let geo = {}

            this.worldCovid.covid[parseInt(this.value)].forEach(element=>{
                // console.log(element.geo)
                if(element.geo != null){
                    geo[element.geo] = element
                }
            })
            
            this.map.data.forEach((feature)=>{
                if(feature.getProperty("name") in geo){
                    let num = parseInt(geo[feature.getProperty("name")][this.dataStyle])
                    let percent = this.caculatePercent(num)
                    let color = this.caculateColor(percent)
                    this.changeBar(feature,color,percent)
                }
            });
        },
        switchCountryName(mapName){
            this.$emit("changeMap",mapName);
        }
    },
    created(){
        this.getCovidData()
    },
    watch:{
        value:function(){
            this.renderMapColor()
            if(this.infoWindow.map != null){
                this.makeInfoWindow(this.GeoclickCountry)
            }
        },
        dataStyle:function(){
            this.value = 0;
            this.map.data.revertStyle()
        }

    }
}

</script>

<style scoped>
.google-map {
    width: 78%;
    height: 400px;
    left:1%;
}
div#barline{
    width: 80%;
    margin:0 auto;
    background-color: seashell;
    padding: 10px;
}
div.bar h3{
    text-align: center;
    margin:3px;
}
div.bar p{
    margin: 0;
    margin-left:5px;
}
div.bar input{
    width: 95%;
    margin-bottom: 8px;
}
#wrap{
	display: inline-flex;
}
#mapTab{
    display: inline-flex;
    position: absolute;
    width: auto;
    height: auto;
    background-color: seashell;
    left: 1%;
}


</style>