<template>
  <div id="word-list">
    <div class="columns"></div>
    <transition-group name="complete" mode="out-in" tag="div">
      <div v-bind:key="word.id" v-for="word in words">
        <WordItem
          v-bind:word="word"
          v-bind:paused="paused"
          v-on:lock-question="lockQuestion"
        />
      </div>
    </transition-group>
  </div>
</template>

<script>
  import WordItem from "./WordItem";

  export default {
    name: "Words",
    components: {
      WordItem,
    },
    props: ["words", "quizLength", "wordLog"],
    data() {
      return {
        columns: ["Character", "Pinyin", "Meaning", "Done"],
        paused: false,
      };
    },
    computed: {
      finished() {
        return this.wordLog.length === this.quizLength;
      },
    },
    methods: {
      lockQuestion(word) {
        this.paused = true;
        this.wordLog.push(word);
        let words = this.words;
        let idx = words.findIndex((w) => w.id === word.id);
        let th = this;
        setTimeout(() => {
          words.splice(idx, 1);
          th.paused = false;
        }, 3000);
        if (this.finished) this.$emit("show-results");
      },
    },
  };
</script>

<style scoped>
  #word-list {
    margin-top: 100px;
  }

  .complete-enter-active,
  .complete-leave-active {
    transition: opacity 0.5s;
  }

  .complete-enter,
  .complete-leave-to {
    opacity: 0;
  }
</style>