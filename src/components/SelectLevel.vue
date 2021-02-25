<template>
  <div class="quiz-selection" v-if="!disabled">
    <h2>你好！</h2>
    <p>
      This web app generates random flashcard-like drills for a given HSK level.
      <a
        target="_blank"
        href="https://en.wikipedia.org/wiki/Hanyu_Shuiping_Kaoshi"
        >HSK</a
      >
      (<span class="zh">汉语水平考试</span>) is a standardization of Mandarin
      Chinese proficiency.
      <i>Note: this web app uses <b>Simplified</b> Chinese characters.</i>
    </p>
    <h3>Ready for a drill?</h3>
    <p>First, select a level. Then go!</p>
    <div class="cards">
      <div class="hsk-card" v-for="(level, idx) in levels" v-bind:key="idx">
        <button class="card" @click="pickLevel(idx + 1, $event)">
          {{ levels[idx] }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "SelectLevel",
    data() {
      return {
        selected: null,
        disabled: false,
        levels: ["一", "二", "三", "四", "五", "六"],
      };
    },
    methods: {
      pickLevel(level, e) {
        e.preventDefault();
        this.selected = level;
        this.disabled = true;
        this.$emit("level-selected", level);
      },
    },
    computed: {
      // ready() {
      //   return this.disabled ? true : !this.selected;
      // },
    },
  };
</script>

<style scoped>
  .quiz-selection {
    padding: 10px;
    margin: 0 auto;
    text-align: center;
    max-width: 630px;
  }

  .cards {
    margin: 0 auto;
    display: flex;
    flex: auto;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    max-width: 500px;
  }

  .hsk-card {
    padding: 18px 8px;
    font-size: 28px;
    font-family: "Noto Sans SC", sans-serif;
  }

  button {
    padding: 24px 26px;
    margin-left: 10px;
    border: none;
    font-size: inherit;
    transition-duration: 300ms;
    /* background: #ccc; */
  }

  button:hover {
    background: #ccc;
    /* color: #f2f2f2; */
    transition-duration: 300ms;
    text-shadow: 0 1px 2px #fff;
  }

  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn:hover {
    background: #666;
  }

  p {
    margin-top: 5px;
    margin-bottom: 10px;
  }
</style>