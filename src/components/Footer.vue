<template>
  <div class="footer">
    (c) <a :href="github">Lictor Guzman</a>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {
      github: "https://github.com/lctr"
    }
  }
}
</script>

<style>
  .footer {
    margin: 50px auto;
    text-align: center;
    padding: 15px 0;
    width: 100%;
    height: 50px;
    left: 0;
    bottom: 0;
    color: #999;
    /* background-color: rgba(240, 240, 240, 0.9); */
    /* box-shadow: 0 0 2px #666; */
  }
</style>