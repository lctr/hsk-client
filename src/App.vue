<template>
  <div id="app">
    <Header />
    <SelectLevel v-on:level-selected="loadQuiz" />
    <div v-if="loading">
      <LoadingDots />
    </div>
    <div id="quiz" v-if="loaded">
      <Words v-bind:words="words" v-on:lock-question="logAttempt" />
    </div>
    <div v-if="attempted === quizLength">
      Attempted: {{ attempted }} <br>
      Score: {{ finalScore }} <br>
      Correct pronunciation count: {{ correctPinyin }} <br>
      Correct meaning count: {{ correctMeaning }} 
    </div>
    <div v-if="sleepingServer">
      Server's asleep. Awaken her?? 
    </div>
  </div>
</template>

<script>
import Header from './components/Header';
import SelectLevel from './components/SelectLevel';
import LoadingDots from './components/LoadingDots';
import Words from './components/Words';
import axios from 'axios';

const SERVER = 'http://localhost:4001';

export default {
  name: 'App',
  components: {
    Header,
    SelectLevel,
    LoadingDots,
    Words
  }, data() {
    return {
      sleepingServer: true,
      quizzing: false,
      loading: false,
      loaded: false,
      words: [],
      wordBank: [],
      quizLength: 25,
      attempted: 0,
      correctPinyin: 0,
      correctMeaning: 0,
      finalScore: null
    }
  }, 
  methods: {
    loadQuiz(level) {
      this.toggleLoading();
      axios.get(`${SERVER}/words/bylevel/${level}`)
        .then(words => {
          this.words = this.prepareQuiz(words.data); 
          this.toggleLoading();
          this.quizzing = true; 
        })
        .catch(e => {
          console.log(e);
          this.toggleLoading(); 
          this.quizzing = false; 
        }); 
    },
    prepareQuiz(words) {
      const len = words.length; 
      let indxs = [], r = this.quizLength, rand;
      do {
        rand = Math.floor(Math.random() * len);
        if (indxs.includes(rand)) {
          r++;
        } else {
          indxs.push(rand);
        }
        r--;
      } while (r);
      for (let i = 0; i < this.quizLength; i++) {
        indxs[i] = words[indxs[i]]; 
      }
      return indxs; 
    },
    toggleLoading() {
      this.loading = !this.loading; 
      this.loaded = !this.loading; 
    },
    logAttempt(score) {
      let { pronunciation, meaning} = score; 
      this.attempted += 1; 
      this.correctPinyin += pronunciation; 
      this.correctMeaning += meaning; 

      if (this.attempted === this.quizLength) {
        this.quizzing = false; 
        this.finalScore = this.quizScore(); 
      }
    }
  },
  computed: {
    quizScore() {
      let denominator = 2 * this.attempted, 
        numerator = this.correctPinyin + this.correctMeaning; 
      if (denominator) {
        return Math.round((numerator / denominator) * 100, 4); 
      } else {
        return 0;
      }
    }
  },
  created() {
    axios.get(`${SERVER}/words/ping`)
      .then(res => this.sleepingServer = !res)
      .catch(e => {
        console.error(e); 
        this.sleepingServer = true; 
      });
  }
}
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: Helvetica, sans-serif;
    line-height: 1.4;
  }

  #app {
    margin: 0 auto; 
    width: 98%;
  }

  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 7px 20px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn:hover {
    background: #666;
  }
</style>
