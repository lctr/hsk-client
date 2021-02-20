<template>
  <div class="word-item" v-if="!locked">

    <div class="word-item-character"> 
      {{ word.character }}
    </div>

    <div class="word-item-pinyin">
      <input type="text" name="userPinyin" 
        v-model="pinyinAnswer"
        v-bind:class="pronunciationStatus"
        placeholder="pinyin"
        autocomplete="off">
    </div>

    <div class="word-item-meaning">
      <input type="text" name="userMeaning" 
        v-model="meaningAnswer"
        v-bind:class="meaningStatus"
        placeholder="meaning"
        autocomplete="off">
    </div>

    <div class="word-item-complete">
      <button class="checkbox" 
        v-on:click="recordAttempt">
        ✓
      </button>
    </div>

    <div v-if="gaveUp">
      {{ word.character }} || {{ word.pinyin }} || {{ word.meaning }}
      <br>
      W O M P ! <br>
      -1 point for u :/ 
    </div>
  </div>
</template>

<script>
export default {
  name: "WordItem",
  props: ["word"],
  data() {
    return {
      pinyinAnswer: '',
      meaningAnswer: '',
      locked: false,
      gaveUp: false
    }
  },
  computed: {
    attempted() {
      return this.pinyinAnswer + this.meaningAnswer; 
    },
    pronunciationStatus() {
      let correct = false, incorrect = false; 
      if (this.pinyinAnswer) {
        if (this.correctPinyin) {
          correct = true; 
        } else {
          incorrect = true;
        }
      }
      return { 'is-correct': correct, 'is-incorrect': incorrect };
    },
    correctPinyin() { 
      let answer = [this.word.pinyin, this.word.pin1yin1], 
        attempt = this.pinyinAnswer.trim().toLowerCase(); 
      return answer.includes(attempt);
    },
    meaningStatus() {
      let correct = false, incorrect = false;
      if (this.meaningAnswer) {
        if (this.correctMeaning) {
          correct = true;
        } else {
          incorrect = true; 
        }
      }
      return { 'is-correct': correct, 'is-incorrect': incorrect }; 
    }, 
    correctMeaning() {
      let answer = this.word.english,
        attempt = this.meaningAnswer.trim().toLowerCase();
      return answer === attempt; 
    }
  },
  methods: {
    recordAttempt() {
      this.locked = true; 
      let score = {
        word: this.word,
        input: { pinyin: this.pinyinAnswer, meaning: this.meaningAnswer },
        attempted: this.attempted ? 1 : 0,
        pronunciation: this.correctPinyin ? 1 : 0,
        meaning: this.correctMeaning ? 1 : 0
      };
      let input = [this.pinyinAnswer, this.meaningAnswer]; 

      if (!input.join('').trim()) {
        score = this.giveUp(score); 
      }
      this.$emit('lock-question', score);
    },
    giveUp(score) {
      score.attempted = 0; 
      score.pronunciation = -1; 
      score.meaning = -1;
      return score; 
    }
  }
}
</script>

<style>
  :root {
    --dt: 900ms; 
  }

  .word-item {
    background: #f2f2f2;
    padding: 10px; 
    border-bottom: 1px #ccc dotted;
    display: grid; 
    grid-template-columns: minmax(160px, auto) 1fr 1fr 50px;
    column-gap: 0.5em; 
    align-items: center;
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
  }

  .checkbox {
    padding: 4px 10px;
    display: inline-block;
    border-radius: 15px;
    border: 1px solid #ccc; 
    font-size: 18px;
  }

  .checkbox:hover {
    background-color: #333; 
    color: #f2f2f2; 
    transition-duration: 500ms;
  }
  
  input {
    padding: 6px 8px; 
    display: inline-block;
    border-radius: 10px;
    border: 1px solid #999;
    background-color: #f9f9f9; 
  }

  .is-correct {
    color: #2c4634; 
    background-color: #c6ebc9;
    transition-delay: var(--dt);
  }

  .is-incorrect {
    color: #7e4646; 
    background-color: #ffb4b4;
    transition-delay: var(--dt);
  }
</style>