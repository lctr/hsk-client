<template>
  <div id="quiz-results">
    <h1>Results</h1>
    <p>On this glorious {{date}}, you have achieved the following quiz scores.</p>
    <table class="results">
      <thead>
        <tr>
          <th colspan="2">Overall</th>
          <th colspan="2">Pinyin</th>
          <th colspan="2">Meaning</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>attempted: </td>
          <td>{{attempted - skipped}}</td>
          <td># correct: </td>
          <td>{{correctPinyin}}</td>
          <td># correct: </td>
          <td>{{correctMeaning}}</td>
        </tr>
        <tr>
          <td>score: </td>
          <td>{{overallScore}}%</td>
          <td>score: </td>
          <td>{{correctPinyin / attempted}}%</td>
          <td>score: </td>
          <td>{{ correctMeaning / attempted}}%</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "QuizResults",
  props: [
    "wordLog", "skippedWords", "quizLength", 
    "attempted", "correctPinyin", "correctMeaning"
  ],
  data() {
    return {
      date: new Date().toUTCString(),
    }
  },
  methods: {},
  computed: {
    skipped() {
      let both = this.skippedWords.length; 
      return both; 
    },
    overallScore() {
      let denominator = 2 * this.attempted, 
        numerator = this.correctPinyin + this.correctMeaning; 
      if (denominator) {
        return Math.round((numerator / denominator) * 100, 4); 
      } else {
        return 0;
      }
    }
  }
}
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