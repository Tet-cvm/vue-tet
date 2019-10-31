<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script lang="ts">
export default {
  name: 'App',
  data () {
    return {

    }
  }
}
</script>

<style lang="less">
*{margin:0px;padding:0px;font-size:15px;border:0px;outline: 0;font-weight:normal;-webkit-text-size-adjust: none;-webkit-tap-highlight-color: transparent;-webkit-box-sizing: border-box;box-sizing: border-box;}
html,body{margin:0px;padding:0px;width:100%;font-family: 'Avenir', Helvetica, Arial, sans-serif;font-size:15px;background-color:#f4f4f4;}
img{display:block;}
a, u{text-decoration:none;}
b, em, i{font-weight:normal;font-style:normal;}
ul li{list-style-type:none;}
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
}
body {
    margin: 0;
    padding: 0;
}
</style>