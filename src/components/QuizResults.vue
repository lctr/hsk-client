<template>
  <div id="quiz-results">
    <h1>Results</h1>
    <p>
      <b> Quiz date:</b> {{ date }} <br />
      <b> Quiz length:</b> {{ quizLength }} <br />
      <b> Skipped:</b> {{ skipped.length }} <br />
      <b> Overall Score:</b> {{ overallScore }}% <br />
      <b> Pinyin Score:</b> {{ pinyinScore }}% <br />
      <b> Meaning Score:</b> {{ meaningScore }}% <br />
    </p>

    <div class="results">
      <div class="row-headers">
        <div
          class="header-cell"
          v-bind:key="idx"
          v-for="(column, idx) in columns"
        >
          {{ columns[idx] }}
        </div>
      </div>

      <div
        class="row-group"
        v-bind:key="word.id"
        v-for="(word, idx) in wordLog"
      >
        <div class="word-item order">
          {{ idx + 1 }}
        </div>

        <div class="word-item character">
          <span class="zh">{{ word.character }}</span>
        </div>

        <div class="word-item attempt">
          {{
            word.attempted
              ? word.pinyinAttempt + " / " + word.meaningAttempt
              : "-"
          }}
        </div>

        <div class="word-item solution">
          {{ word.pinyin }} / {{ word.english }}
        </div>

        <div class="word-item points">
          {{ word.pinyinScore + word.meaningScore }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "QuizResults",
    props: ["wordLog", "quizLength", "userId"],
    data() {
      return {
        date: new Date().toUTCString(),
        columns: ["#", "Character", "Attempt", "Solution", "Points"],
        skipped: this.wordLog.filter((x) => !x.attempted),
        pinyinCorrect: this.wordLog.reduce((a, c) => a + c.pinyinScore, 0),
        meaningCorrect: this.wordLog.reduce((a, c) => a + c.meaningScore, 0),
      };
    },
    methods: {
      showAttempt(word) {
        return Object.entries(word)
          .map((x) => x.join(": "))
          .join(", ");
      },
      score(n, d) {
        return Number(((n * 100) / d / 100).toFixed(2) * 100);
      },
    },
    computed: {
      pinyinScore() {
        return this.score(this.pinyinCorrect, this.quizLength);
      },
      meaningScore() {
        return this.score(this.meaningCorrect, this.quizLength);
      },
      overallScore() {
        return this.score(
          this.pinyinCorrect + this.meaningCorrect,
          2 * this.quizLength
        );
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

  .row-header {
    font-size: 10px;
  }

  .word-item {
    background: #f2f2f2;
    margin: 0 auto;
    display: grid;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border-bottom: 1px #ccc dotted;
    align-items: center;
    justify-content: center;
    gap: 0 10px;
  }

  .word-item:hover {
    background: #e2e2e2;
  }

  .word-item:hover .word-item-character {
    text-shadow: 0px 2px 2px #f2f2f2;
  }

  .word-item-character {
    font-size: 2.5em;
    text-align: center;
    display: block;
    font-family: "Noto Sans SC", sans-serif;
  }

  .word-item-pinyin,
  .word-item-meaning {
    display: block;
  }

  input {
    padding: 6px 8px;
    display: block;
    border-radius: 10px;
    border: 1px solid #999;
    background-color: #f9f9f9;
    box-sizing: border-box;
    width: 98%;
  }

  input:disabled {
    font-family: monospace;
  }

  .is-correct {
    color: #2c4634;
    background-color: #c6ebc9;
  }

  .is-incorrect {
    color: #7e4646;
    background-color: #ffb4b4;
  }

  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }

  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }

  @media only screen and (min-width: 615px) {
    .word-item {
      display: grid;
      margin: 0 auto;
      padding: 10px;
      grid-template-columns: minmax(180px, 30%) 28% 28% auto;
      max-width: 700px;
      gap: 5px;
    }
  }

  @media only screen and (max-width: 615px) {
    .word-item {
      width: 98vw;
      gap: 0 10px;
      grid-template-areas:
        "a b d"
        "a c d";
    }
    .word-item-character {
      width: 37vw;
      grid-column: 1 / span 1;
      grid-row: 1 / span 2;
    }
    .word-item-pinyin {
      width: 43vw;
      grid-column: 2 / span 1;
      grid-row: 1 / span 1;
    }
    .word-item-meaning {
      width: 43vw;
      grid-column: 2 / span 1;
      grid-row: 2 / span 1;
    }
    .word-item-complete {
      width: 50px;
      grid-column: 3 / span 1;
      grid-row: 1 / span 2;
    }
  }
</style>