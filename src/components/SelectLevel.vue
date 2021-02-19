<template>
  <div class="quiz-selection" v-if="!disabled">
    <select v-model="selected" :disabled="disabled">
      <option disabled value="">Please select one</option>
      <option v-for="(level, idx) in levels" v-bind:key="idx"> 
        {{ levels[idx] }} 
      </option>
    </select>
    <button class="btn" @click="levelSelected" :disabled="ready">Go!</button>
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
    z-index: 999;
  }

  select {
    padding: 4px 6px; 
    width: 200px;
  }

  button {
    padding: 4px 6px;
    margin-left: 10px;
  }

</style>