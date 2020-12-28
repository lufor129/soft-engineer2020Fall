<template>

  <div id="app">
      <div id="header" class="container">
			<div id="logo">
				<h1><a href="/"><span>COVID-19</span>Platform</a></h1>
			</div>
		</div>
    <router-view/>
  </div>
  
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
#app {
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	color: #2c3e50;
	text-align:center;
	overflow: hidden;
	background: #FFF;


}

html, body
{
	height: 100%;
	width: 100%;
}

body
{
	margin: 0px;
	padding: 0px;
	font-family: 'Open Sans', sans-serif;
	color: #000000;
}
h1, h2, h3
{
	margin: 0;
	padding: 0;
}


.container
{
	text-align:left;
	width: 100%;
	margin: 0px auto;
}

#header
{
	overflow: hidden;
	border-bottom: 1px solid #E7E7E7;
}

#logo
{
	width: 100%;
}

#logo h1 a
{
	display: block;
	line-height: 100px;
	text-transform: uppercase;
	text-decoration: none;
	font-family: 'Archivo Narrow', sans-serif;
	font-size: 1.3em;
	color: #3E3E3E;
}

#logo span
{
	color: #8EBEAE;
}

</style>
