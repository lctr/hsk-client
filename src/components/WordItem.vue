<template>
  <transition name="completed" mode="in-out">
  <div class="word-item">
    <div class="word-item-character"> 
      {{ word.character }}
    </div>

    <div class="word-item-pinyin">
      <input type="text" name="userPinyin" 
        v-model="pinyinAnswer"
        v-bind:class="pinyinStatus"
        placeholder="pinyin"
        autocomplete="off"
        spellcheck="false"
        :disabled="locked">
      <transition name="fade" mode="in-out">
        <p v-if="locked">
          {{word.pinyin}}
        </p>
      </transition>
    </div>

    <div class="word-item-meaning">
      <input type="text" 
        name="userMeaning" 
        v-model="meaningAnswer"
        v-bind:class="meaningStatus"
        placeholder="meaning"
        autocomplete="off"
        spellcheck="false"
        :disabled="locked">
      <transition name="fade" mode="in-out">
        <p v-if="locked">
          {{word.english}}
        </p>
      </transition>
    </div>

    <div class="word-item-complete">
      <button class="checkbox" 
        v-on:click="recordAttempt" 
        :disabled="locked">
        ✓
      </button>
    </div>
  </div>
  </transition>
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
      gaveUp: false,
    }
  },
  computed: {
    attempted() {
      return this.pinyinAnswer + this.meaningAnswer; 
    },
    pinyinStatus() {
      return this.validation('pinyin');
    },
    correctPinyin() { 
      let answer = [this.word.pinyin, this.word.pin1yin1], 
        attempt = this.pinyinAnswer.trim().toLowerCase(); 
      return answer.includes(attempt);
    },
    meaningStatus() {
      return this.validation('meaning');
    }, 
    correctMeaning() {
      let answer = this.word.english,
        attempt = this.meaningAnswer.trim().toLowerCase();
      return answer === attempt; 
    },
  },
  methods: {
    validation(kind) {
      let correct = false, 
        incorrect = false, 
        locked = this.locked && true,
        input = `${kind}Answer`,
        status = `correct${kind[0].toUpperCase()}${kind.slice(1)}`;
      if (this[input]) {
        if (this[status]) {
          correct = locked;
        } else {
          incorrect = locked;
        }
      }
      return { 'is-correct': correct, 'is-incorrect': incorrect };
    },
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
  .word-item {
    background: #f2f2f2;
    margin: 0 auto; 
    padding: 10px; 
    border-bottom: 1px #ccc dotted;
    display: grid; 
    grid-template-columns: minmax(180px, 30%) 28% 28% auto;
    column-gap: 0.5em; 
    align-items: center;
    justify-content: center;
    min-width: max-content; /*590px;*/
    max-width: min-content;
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
    border: 1px solid #999; 
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

  .fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
  }

  .fade-enter, .fade-leave-to 
    /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
  }

  .complete-leave-active {
    transition: all 500ms ease-out 3s;
  }
  .complete-leave-to {
    display: none;
  }

</style>