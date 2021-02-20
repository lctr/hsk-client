<template>
  <div class="quiz-selection" v-if="!disabled">
    <h3>Select an HSK level to be quizzed on.</h3>
    <select v-model="selected" :disabled="disabled">
      <option disabled value="">Please select one</option>
      <option v-for="(level, idx) in levels" v-bind:key="idx"> 
        {{ levels[idx] }} 
      </option>
    </select>
    <button class="btn" @click="levelSelected" :disabled="ready">
      开始 ~ <i>start</i> !
    </button>
  </div>
</template>

<script>
export default {
  name: "SelectLevel",
  data() {
    return {
      selected: null,
      disabled: false,
      levels: ['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6']
    }
  },
  methods: {
    levelSelected(e) {
      e.preventDefault();
      const level = this.selected.replace('hsk', '');
      console.log(level); 
      this.disabled = true; 
      this.$emit('level-selected', level);
    }
  },
  computed: {
    ready() {
      return this.disabled ? true : !this.selected; 
    }
  }
}
</script>

<style scoped>
  .quiz-selection {
    padding: 10px; 
    margin: auto;
    text-align: center; 
  }

  select, option {
    padding: 4px 6px; 
    min-width: 200px;
    border-radius: 4px;
  }

  button {
    padding: 4px 6px;
    margin-left: 10px;
  }

  .btn {
    display: inline-block;
    border: none;
    background: #555;
    color: #fff;
    padding: 4px 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btn:hover {
    background: #666;
  }

</style>