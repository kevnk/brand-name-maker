<template>
  <div class="maker">
    <div v-if="curStepIndex < steps.length">
      <h2>{{ curStep }}</h2>
      <small class="step"
        >step {{ curStepIndex + 1 }} / {{ steps.length }}</small
      >
      <div v-if="curStepIndex === 0">
        <p>What <i>feelings</i> do you want your brand to invoke?</p>
        <input
          type="text"
          v-bind:placeholder="feelings.length ? '' : 'eg. Relieved'"
          ref="feelings"
          v-model="feelingInput"
          @keypress="addFeelings"
        />
        <small>hit "Enter" to add your feeling</small>
        <div v-for="(feeling, index) in feelings">
          {{ feeling.val }}
          <button class="btn remove" @click="removeFeeling(index);">
            <b>&times;</b>
          </button>
        </div>
      </div>
      <div v-if="curStepIndex === 1">2</div>
      <div v-if="curStepIndex === 2">3</div>
    </div>
    <div v-else>done</div>
    <div class="actions">
      <button
        v-if="curStepIndex - 1 >= 0"
        class="btn back"
        @click.prevent="curStepIndex = curStepIndex - 1;"
      >
        &larr; BACK
      </button>
      <button
        v-if="curStepIndex + 1 < steps.length"
        class="btn next"
        @click.prevent="curStepIndex = curStepIndex + 1;"
      >
        NEXT &rarr;
      </button>
      <button
        v-if="curStepIndex + 1 === steps.length"
        class="btn finish"
        @click.prevent="curStepIndex = curStepIndex + 1;"
      >
        FINISH
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: "BrandNameMaker",
  data() {
    return {
      steps: ["Feelings", "Embodiment", "Characteristic"],
      curStepIndex: 0,
      feelings: localStorage.getItem("feelings")
        ? JSON.parse(localStorage.getItem("feelings"))
        : [],
      feelingInput: "",
    };
  },
  computed: {
    curStep() {
      return this.steps[this.curStepIndex];
    },
  },
  methods: {
    addFeelings(e) {
      if (e.charCode === 13) {
        let feeling = e.target.value;
        this.feelings.push({ val: feeling });
        this.feelingInput = "";
      }
    },
    removeFeeling(index) {
      this.feelings.splice(index, 1);
    },
  },
  watch: {
    feelings() {
      localStorage.setItem("feelings", JSON.stringify(this.feelings));
    },
  },
};
</script>

<style lang="scss">
.maker {
  padding-top: 20px;
  max-width: 600px;
  margin: 0 auto;
  h2 {
    margin-bottom: 0px;
  }
  .step {
    opacity: 0.5;
    text-transform: uppercase;
  }
}
input[type="text"] {
  display: block;
  padding: 10px 15px;
  text-align: center;
  margin: 0 auto 5px;
  width: 250px;
  max-width: 100%;
  font-size: 16px;
}
.actions {
  padding: 20px 0;
}
.btn {
  outline: none;
  border: none;
  padding: 10px 20px;
  background: skyblue;
  border-radius: 3px;
  margin: 0;
  &:hover {
    cursor: pointer;
  }
  &.back {
    float: left;
  }
  &.next,
  &.finish {
    float: right;
  }
  &.remove {
    background: transparent;
    color: salmon;
  }
}
</style>
