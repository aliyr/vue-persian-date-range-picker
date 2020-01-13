<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" />
    <vue-date-range-picker
      label="تاریخ"
      v-model="date"
      :range="true"
      format="YY/MM/D HH:mm"
      min="1388/12/23"
      max="1432/6/23"
      :time="true"
      theme-color="#32CD32"
    ></vue-date-range-picker>
  </div>
</template>

<script>
import VueDateRangePicker from "./components/VueDateRangePicker";

export default {
  name: "app",
  components: {
    VueDateRangePicker
  },
  data() {
    return {
      date: ""
    };
  }
};
</script>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
