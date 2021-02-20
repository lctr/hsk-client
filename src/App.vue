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
      <QuizResults v-if="completed"
        v-bind:wordLog="wordLog" 
        v-bind:attempted="attempted"
        v-bind:skippedWords="skippedWords"
        v-bind:quizLength="quizLength"
        v-bind:correctPinyin="correctPinyin"
        v-bind:correctMeaning="correctMeaning" />
    </div>
    <div v-if="sleepingServer">
      Server's asleep. Awaken her?? 
    </div>
  </div>
</template>

<script>
import Utils from './assets/utils'; 
import Header from './components/Header';
import SelectLevel from './components/SelectLevel';
import LoadingDots from './components/LoadingDots';
import Words from './components/Words';
import QuizResults from './components/QuizResults';
import axios from 'axios';

const SERVER = 'http://localhost:4001';

export default {
  name: 'App',
  components: {
    Header,
    SelectLevel,
    LoadingDots,
    Words,
    QuizResults
  }, data() {
    return {
      sleepingServer: null,
      quizzing: false,
      loading: false,
      loaded: false,
      words: [],
      wordLog: [],
      skippedWords: [],
      quizLength: 25,
      attempted: 0,
      correctPinyin: 0,
      correctMeaning: 0,
      completed: false
    }
  }, 
  methods: {
    loadQuiz(level) {
      this.toggleLoading();
      axios.get(`${SERVER}/words/bylevel/${level}`)
        .then(words => {
          this.words = Utils.shuffleArray(words.data, this.quizLength); 
          this.toggleLoading();
          this.quizzing = true; 
        })
        .catch(e => {
          console.log(e);
          this.toggleLoading(); 
          this.quizzing = false; 
        }); 
    },
    toggleLoading() {
      this.loading = !this.loading; 
      this.loaded = !this.loading; 
    },
    // functionally equivalent to a "next", only the order in which 
    // this quiz is completed does not matter
    logAttempt(score) {
      let { pronunciation, meaning, attempted, input, word } = score; 
      // take user input and update appropriate quiz metrics to be used
      // by QuizResults subcomponent
      this.attempted += 1; 
      this.correctPinyin += pronunciation; 
      this.correctMeaning += meaning; 
      word.input = input;
      if (attempted === 0) {
        this.skippedWords.push(word);
      } else {
        this.wordLog.push(word);
      }
      if (this.attempted === this.quizLength) {
        this.quizzing = false; 
        this.completed = true; 
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

</style>
