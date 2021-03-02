<template>
  <div id="app">
    <Header />
    <SelectLevel v-on:level-selected="loadQuiz" />
    <div v-if="loading">
      <LoadingDots />
    </div>
    <div id="quiz" v-if="loaded">
      <Words
        v-bind:words="words"
        v-bind:wordLog="wordLog"
        v-on:show-results="showResults"
      />
    </div>
    <div v-if="completed">
      <QuizResults v-bind:wordLog="wordLog" v-bind:quizLength="quizLength" />
    </div>
    <div v-if="sleepingServer">Server's asleep. Awaken her??</div>
  </div>
</template>

<script>
  import Utils from "./assets/utils";
  import Header from "./components/Header";
  import SelectLevel from "./components/SelectLevel";
  import LoadingDots from "./components/LoadingDots";
  import Words from "./components/Words";
  import QuizResults from "./components/QuizResults";
  import axios from "axios";

  const SERVER = "https://hsk-server.herokuapp.com";

  export default {
    name: "App",
    components: {
      Header,
      SelectLevel,
      LoadingDots,
      Words,
      QuizResults,
    },
    data() {
      return {
        sleepingServer: null,
        quizzing: false,
        loading: false,
        loaded: false,
        words: [],
        quizLength: 15,
        wordLog: [],
        attempted: 0,
        completed: false,
      };
    },
    methods: {
      loadQuiz(level) {
        if (this.sleepingServer) return;
        this.toggleLoading();
        axios
          .get(`${SERVER}/words/bylevel/${level}`)
          .then((words) => {
            this.words = Utils.shuffleArray(words.data, this.quizLength);
            this.toggleLoading();
            this.quizzing = true;
          })
          .catch((e) => {
            console.log(e);
            this.toggleLoading();
            this.quizzing = false;
          });
      },
      toggleLoading() {
        this.loading = !this.loading;
        this.loaded = !this.loading;
      },
      showResults() {
        this.toggleLoading();
        this.quizzing = false;
        this.completed = true;
        let $this = this;
        setTimeout(() => $this.toggleLoading(), 1000);
      },
    },
    created() {
      axios
        .get(`${SERVER}/words/ping`)
        .then((res) => (this.sleepingServer = !res))
        .catch((e) => {
          console.error(e);
          this.sleepingServer = true;
        });
    },
  };
</script>

<style>
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    margin-top: 80px;
    font-family: "Source Sans Pro", Helvetica, sans-serif;
    line-height: 1.4;
  }

  #app {
    margin: 0 auto;
    width: 98vw;
  }

  .zh {
    font-family: "Noto Sans SC", sans-serif;
  }

  a {
    color: #333;
  }

  a:hover {
    color: #999;
  }
  a:visted {
    color: #666;
  }
</style>
