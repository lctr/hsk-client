<template>
  <div id="word-list">
    <div class="columns"></div>
    <div v-bind:key="word.id" v-for="word in words">
      <transition name="complete" mode="in-out">
        <WordItem v-bind:word="word" v-on:lock-question="lockQuestion" />
      </transition>
    </div>
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
      };
    },
    computed: {
      finished() {
        return this.wordLog.length === this.quizLength;
      },
    },
    methods: {
      lockQuestion(word) {
        this.wordLog.push(word);
        let words = this.words;
        let idx = words.findIndex((w) => w.id === word.id);

        setTimeout(() => words.splice(idx, 1), 3000);

        if (this.finished) this.$emit("show-results");
      },
    },
  };
</script>

<style scoped>
  #word-list {
    margin-top: 100px;
  }

  .complete-leave-active {
    opacity: 0;
    transition: all 3s ease-out 3s;
  }
  .complete-leave-to {
    opacity: 0 3s;
  }
</style>