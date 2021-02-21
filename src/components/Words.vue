<template>
  <div id="word-list">
    <div v-bind:key="word.id" v-for="word in words">
      <WordItem v-bind:word="word" v-on:lock-question="lockQuestion"/>
    </div>
  </div>
</template>

<script>
import WordItem from './WordItem';

export default {
  name: "Words",
  components: {
    WordItem
  }, 
  props: ["words"],
  methods: {
    lockQuestion(score) {
      this.$emit('lock-question', score); 
    }
  }
}
</script>

<style scoped>
  #word-list {
    margin-top: 40px; 
  }
</style>