<template>
  <div v-if="!minimized">
    <div v-if="!loggedIn" class="user-login">
      <div class="pane-controls">
        <a href="#" :click="(loggingIn = false)">x</a>
      </div>
      <div class="user-name">
        <label for="username">Username: </label>
        <input
          id="username"
          type="text"
          v-model="username"
          placeholder="username"
        />
      </div>
      <div class="user-password">
        <label for="password">Password: </label>
        <input
          id="password"
          :type="pwInputType"
          v-model="password"
          placeholder="password"
        />
        <button type="password" @click="togglePassword">Show pw</button>
      </div>

      <div class="user-choice">
        <label for="login">Log in</label>
        <input type="radio" id="log-in" value="log-in" v-model="selected" />

        <label for="sign-up">Sign up</label>
        <input type="radio" id="sign-up" value="sign-up" v-model="selected" />

        <button id="user-action" @click="whichEntry" :disabled="disabled">
          {{ selected ? selected : "···" }}
        </button>
      </div>
      <div class="login-failure" v-if="error">
        An error occurred. <br />
        <b>Details:</b>
        <p>{{ error }}</p>
      </div>
    </div>
    <div v-else-if="minimized">
      <a href="#" :click="(minimized = false)">Login</a>
    </div>
  </div>
</template>

<script>
  import axios from "axios";

  export default {
    name: "Login",
    props: ["loggedIn"],
    data() {
      return {
        selected: "",
        username: "",
        password: "",
        pwInputType: "password",
        error: "",
        minimized: true,
      };
    },
    methods: {
      togglePassword() {
        this.pwInputType = this.pwInputType === "password" ? "text" : "password";
      },
      whichEntry() {
        if (this.selected === "log-in") {
          this.login();
        } else if (this.selected === "sign-up") {
          this.signup();
        }
      },
      isAlphanumeric(str) {
        return /^[a-zA-Z0-9]+$/.test(str);
      },
      async isUser() {
        const res = await axios.get(`${this.serverBase}/users/${this.username}`);
        console.log(res.data);
        return res.data;
      },
      signup() {
        axios
          .get(`${this.serverBase}/users/${this.username}`)
          .then((res) => {
            if (res.data === false) {
              axios
                .post(`${this.serverBase}/users/create`, {
                  username: this.username,
                  password: this.password,
                })
                .then(() => this.login())
                .catch((err) => {
                  this.error = err;
                  console.error(err);
                });
            }
          })
          .catch(console.error);
      },
      login() {
        axios
          .post(`${this.serverBase}/users/login`, {
            username: this.username,
            password: this.password,
          })
          .then((res) => {
            if (res.data.loggedIn) {
              // pass up user id, which is necessary for saving scores
              this.$emit("logged-in", res.data.id);
            }
          })
          .catch((e) => console.error(e));
      },
      loginFail() {},
    },
    computed: {
      serverBase() {
        return "http://localhost:4001"; // 'https://hsk-server.herokuapp.com';
      },
      disabled() {
        return this.selected.length
          ? !(
              this.username &&
              this.password &&
              this.isAlphanumeric(this.username) &&
              this.isAlphanumeric(this.password)
            )
          : true;
      },
    },
  };
</script>

<style scoped>
  .user-login {
    position: fixed;
    width: 175px;
    margin: 0 auto;
    padding: 8px 16px;
    text-align: center;
    background-color: rgba(235, 235, 235, 0.6);
    backdrop-filter: blur(3px);
    border: 1px solid #ccc;
    border-radius: 5px;
    box-shadow: 0 0px 2px #aaa;
  }
  .user-login div {
    padding-bottom: 4px;
  }
  #user-action {
    margin-left: 5px;
    width: 75px;
  }
  .login-failure {
    font-size: 12px;
  }
  button,
  input {
    padding: 4px 6px;
    border-radius: 5px;
    border: 1px solid #aaa;
  }
  label {
    float: left;
    clear: none;
    display: block;
    font-size: 14px;
    margin-left: 4px;
  }
  input {
    display: inline;
  }
  input[type="radio"] {
    float: left;
    clear: none;
    margin: 4px 0 0;
    width: 25px;
  }
</style>