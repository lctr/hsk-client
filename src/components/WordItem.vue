<template>
  <div class="word-item" v-if="!locked">
    <div class="word-item-complete">
      <input class="checkbox" type="checkbox" v-on:change="recordAttempt">
    </div>
    <div class="word-item-character"> 
      {{ word.character }}
    </div>
    <div class="word-item-pinyin">
      <input type="text" name="userPinyin" 
        v-model="pinyinAnswer"
        v-bind:class="pronunciationStatus"
        placeholder="pinyin">
    </div>
    <div class="word-item-meaning">
      <input type="text" name="userMeaning" 
        v-model="meaningAnswer"
        v-bind:class="meaningStatus"
        placeholder="meaning">
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
        attempted: this.attempted ? 1 : 0,
        pronunciation: this.correctPinyin ? 1 : 0,
        meaning: this.correctMeaning ? 1 : 0
      };
      if (this.gaveUp) {
        score = { attempted: 0, pronunciation: -1, meaning: -1 }; 
      }
      this.$emit('lock-question', score);
    },
    giveUp() {
      (this.correctPinyin && this.correctMeaning) 
        ? this.gaveUp = false 
        : this.gaveUp = true; 
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
    grid-template-columns: 50px 200px 1fr 1fr;
    column-gap: 0.5em; 
    align-items: center;
  }

  .word-item-character {
    font-size: 2.5em;
  }

  .checkbox {
    margin-top: 4px;
    padding: 6px 8px;
    height: 1.5em; 
    width: 1.5em;
    display: inline-block;
    border-radius: 5px;
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