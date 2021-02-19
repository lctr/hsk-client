<template>
  <div class="word-item" v-if="!locked">
    <div class="word-item-complete">
      <input type="checkbox" v-on:change="recordAttempt">
    </div>
    <div class="word-item-character"> 
      {{ word.character }}
    </div>
    <div class="word-item-pinyin">
      <input type="text" name="userPinyin" 
        v-model="pinyinAnswer"
        v-bind:class="pronunciationStatus"
        placeholder="pinyin"
        @input="setAttempted">
    </div>
    <div class="word-item-meaning">
      <input type="text" name="userMeaning" 
        v-model="meaningAnswer"
        v-bind:class="meaningStatus"
        placeholder="meaning"
        @input="setAttempted">
    </div>
  </div>
</template>

<script>
export default {
  name: "WordItem",
  props: ["word"],
  data() {
    return {
      attempted: false,
      pinyinAnswer: '',
      meaningAnswer: '',
      locked: false
    }
  },
  computed: {
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
    setAttempted() {
      this.attempted = true; 
    },
    recordAttempt() {
      this.locked = true; 
      const score = {
        attempted: this.attempted ? 1 : 0,
        pronunciation: this.correctPinyin() ? 1 : 0,
        meaning: this.correctMeaning() ? 1 : 0
      }
      this.$emit('lock-question', score);
    }
  }
}
</script>

<style>
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

  input[type='checkbox'] {
    margin-top: 4px;
    padding: 4px 6px;
    height: 1.5em; 
    width: 1.5em;
    display: inline-block;
    border: none;
  }
  input {
    padding: 4px 6px; 
    font-size: 1.5em;
    display: inline-block;
  }

  .is-correct {
    color: #2c4634; 
    background-color: #c6ebc9;
  }

  .is-incorrect {
    color: #7e4646; 
    background-color: #ffb4b4;
  }
</style>