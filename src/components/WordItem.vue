<template>
  <transition name="fade" mode="out-in">
    <div class="word-item columns">
      <div class="word-item-character">
        {{ word.character }}
      </div>

      <div class="word-item-pinyin">
        <input
          type="text"
          name="userPinyin"
          v-model="pinyinAnswer"
          v-bind:class="pinyinStatus"
          placeholder="pinyin"
          autocomplete="off"
          spellcheck="false"
          :disabled="locked"
        />
        <transition name="fade" mode="in-out">
          <p v-if="locked">
            {{ word.pinyin }}
          </p>
        </transition>
      </div>

      <div class="word-item-meaning">
        <input
          type="text"
          name="userMeaning"
          v-model="meaningAnswer"
          v-bind:class="meaningStatus"
          placeholder="meaning"
          autocomplete="off"
          spellcheck="false"
          :disabled="locked"
        />
        <transition name="fade" mode="in-out">
          <p v-if="locked">
            {{ word.english }}
          </p>
        </transition>
      </div>

      <div class="word-item-complete">
        <button class="checkbox" v-on:click="recordAttempt" :disabled="locked">
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
        pinyinAnswer: "",
        meaningAnswer: "",
        locked: false,
        gaveUp: false,
        shown: true,
      };
    },
    computed: {
      attempted() {
        return (this.pinyinAnswer + this.meaningAnswer).trim();
      },
      pinyinStatus() {
        return this.validation("pinyin");
      },
      correctPinyin() {
        // get rid of spaces in correct answers if any
        let answer = [this.word.pinyin, this.word.pin1yin1].map((w) =>
            w.replace(/\s/g, "")
          ),
          attempt = this.pinyinAnswer.trim().toLowerCase();
        return answer.includes(attempt);
      },
      meaningStatus() {
        return this.validation("meaning");
      },
      correctMeaning() {
        let answer = this.word.english,
          attempt = this.meaningAnswer.trim().toLowerCase();
        return answer === attempt;
      },
    },
    methods: {
      hide(el) {
        el.style.display = "none";
      },
      validation(kind) {
        let correct = false,
          incorrect = false,
          locked = this.locked && true,
          input = `${kind}Answer`,
          status = `correct${kind[0].toUpperCase()}${kind.slice(1)}`;
        if (this[input]) {
          this[status] ? (correct = locked) : (incorrect = locked);
        }
        return { "is-correct": correct, "is-incorrect": incorrect };
      },
      recordAttempt() {
        this.locked = true;
        this.word.pinyinAttempt = this.pinyinAnswer;
        this.word.meaningAttempt = this.meaningAnswer;
        this.word.pinyinScore = this.correctPinyin ? 1 : 0;
        this.word.meaningScore = this.correctMeaning ? 1 : 0;
        this.word.attempted = this.attempted ? true : false;
        this.$emit("lock-question", this.word);
      },
    },
  };
</script>

<style>
  .column-headers {
    font-size: 10px;
    margin-bottom: 0;
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

  .word-item-complete {
    text-align: center;
    display: block;
  }

  .word-item-pinyin,
  .word-item-meaning {
    display: block;
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