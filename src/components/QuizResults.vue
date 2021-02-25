<template>
  <div id="quiz-results">
    <h1>Results</h1>
    <p>
      On this glorious {{ date }}, you have achieved the following quiz scores.
    </p>
    <p>
      <b> Quiz length:</b> {{ quizLength }} <br />
      <b> Overall Score:</b> {{ overallScore }} <br />
      <b> Pinyin Score:</b> {{ pinyinScore }} <br />
      <b> Meaning Score:</b> {{ meaningScore }} <br />
    </p>
    <div class="results">
      <ul v-bind:key="word.id" v-for="word in wordLog">
        <li>{{ showAttempt(word) }}</li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QuizResults",
    props: ["wordLog", "quizLength"],
    data() {
      return {
        date: new Date().toUTCString(),
        skipped: this.wordLog.filter((x) => x.gaveUp),
        pinyinCorrect: this.wordLog.reduce((a, c) => a + c.pinyinScore, 0),
        meaningCorrect: this.wordLog.reduce((a, c) => a + c.meaningScore, 0),
      };
    },
    methods: {
      showAttempt(word) {
        return Object.entries(word)
          .map((x) => x.join(" | "))
          .join("\n");
      },
    },
    computed: {
      pinyinScore() {
        return this.pinyinCorrect / this.quizLength;
      },
      meaningScore() {
        return this.meaningCorrect / this.quizLength;
      },
      overallScore() {
        return (this.pinyinCorrect + this.meaningCorrect) / (2 * this.quizLength);
      },
    },
  };
</script>

<style scoped>
  #quiz-results {
    margin-top: 40px;
    margin: auto;
    padding: 4px 6px;
    max-width: 600px;
  }

  table {
    margin-top: 24px;
    padding: 2px 4px;
    table-layout: fixed;
    width: 100%;
    border: 1px solid #ccc;
  }

  th {
    text-align: left;
  }

  p {
    margin-top: 2px;
    margin-bottom: 2px;
  }
</style>