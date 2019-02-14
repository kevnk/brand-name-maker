<template>
  <div class="maker">
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
      :disabled="!feelings.length"
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

    <!-- Step 1 -->
    <div v-if="curStepIndex < steps.length">
      <h2>{{ curStep }}</h2>
      <small class="step"
        >step {{ curStepIndex + 1 }} / {{ steps.length }}</small
      >
      <div v-if="curStepIndex === 0">
        <p>List 2-5 <i>feelings</i> you want your brand to invoke.</p>
        <input
          type="text"
          v-bind:placeholder="feelings.length ? '' : 'eg. Relieved'"
          ref="feelings"
          v-model="feelingInput"
          @keypress="addFeelings"
        />
        <small>hit "Enter" to add your feeling</small>
        <div v-for="(feeling, index) in feelings" class="list-item">
          <b>{{ feeling.val }}</b>
          <button class="btn remove" @click="removeFeeling(index);">
            <b>&times;</b>
          </button>
        </div>
      </div>

      <!-- Step 2 -->
      <div v-if="curStepIndex === 1">
        <p>
          List persons, places, things, and/or phrases that <i>embody</i> for
          each of your feelings. <br /><small>Click one to begin:</small>
        </p>
        <button
          class="btn link"
          :class="{ active: activeFeeling == feeling }"
          v-for="(feeling, index) in feelings"
          @click.prevent="activeFeeling = feelings[index];"
        >
          {{ feeling.val }}
        </button>
        <div style="padding-top:15px;" v-if="activeFeeling">
          <input
            type="text"
            v-model="embodimentInput"
            ref="embodimentInput"
            @keypress="addEmbodiment"
          />
          <small>hit "Enter" to add your embodiment</small>
        </div>
        <div
          class="list-item"
          v-for="(embodiment, index) in embodiments"
          v-if="embodiment.feeling.val == activeFeeling.val"
        >
          <b>{{ embodiment.val }}</b>
          <button class="btn remove" @click="removeEmbodiment(index);">
            <b>&times;</b>
          </button>
        </div>
      </div>

      <!-- Step 3 -->
      <div v-if="curStepIndex === 2">
        <p>
          Finally, identify a specific characteristic of each embodiment.
          <br /><small>Click one to begin:</small><br />
        </p>
        <button
          class="btn link"
          :class="{ active: activeEmbodiment == embodiment }"
          v-for="(embodiment, index) in embodiments"
          @click.prevent="activeEmbodiment = embodiments[index];"
        >
          {{ embodiment.val }}
        </button>
        <div style="padding-top:15px;" v-if="activeEmbodiment">
          <input
            type="text"
            v-model="characteristicInput"
            ref="characteristicInput"
            @keypress="addCharacteristic"
          />
          <small>hit "Enter" to add your characteristic</small>
        </div>
        <div
          class="list-item"
          v-for="(characteristic, index) in characteristics"
          v-if="characteristic.embodiment.val == activeEmbodiment.val"
        >
          <b>{{ characteristic.val }}</b>
          <button class="btn remove" @click="removeCharacteristic(index);">
            <b>&times;</b>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="results">
      <h2>Results</h2>
      <div class="characteristics">
        <div v-for="characteristic in characteristics">
          {{ characteristic.val }}
        </div>
      </div>
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
      embodiments: localStorage.getItem("embodiments")
        ? JSON.parse(localStorage.getItem("embodiments"))
        : [],
      characteristics: localStorage.getItem("characteristics")
        ? JSON.parse(localStorage.getItem("characteristics"))
        : [],
      feelingInput: "",
      embodimentInput: "",
      characteristicInput: "",
      activeFeeling: "",
      activeEmbodiment: "",
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
        this.feelings.unshift({ val: feeling });
        this.feelingInput = "";
      }
    },
    removeFeeling(index) {
      this.feelings.splice(index, 1);
    },
    addEmbodiment(e) {
      if (e.charCode === 13) {
        let embodiment = e.target.value;
        this.embodiments.unshift({
          val: embodiment,
          feeling: this.activeFeeling,
        });
        this.embodimentInput = "";
      }
    },
    removeEmbodiment(index) {
      this.embodiments.splice(index, 1);
    },
    addCharacteristic(e) {
      if (e.charCode === 13) {
        let characteristic = e.target.value;
        this.characteristics.unshift({
          val: characteristic,
          embodiment: this.activeEmbodiment,
        });
        this.characteristicInput = "";
      }
    },
    removeCharacteristic(index) {
      this.characteristics.splice(index, 1);
    },
  },
  watch: {
    feelings() {
      localStorage.setItem("feelings", JSON.stringify(this.feelings));
    },
    embodiments() {
      localStorage.setItem("embodiments", JSON.stringify(this.embodiments));
    },
    characteristics() {
      localStorage.setItem(
        "characteristics",
        JSON.stringify(this.characteristics)
      );
    },
    activeFeeling() {
      setTimeout(() => {
        this.$refs.embodimentInput.focus();
      }, 0);
    },
    activeEmbodiment() {
      setTimeout(() => {
        this.$refs.characteristicInput.focus();
      }, 0);
    },
  },
};
</script>

<style lang="scss">
.maker {
  padding-top: 20px;
  max-width: 30em;
  margin: 0 auto;
  h2 {
    width: 50%;
    margin: 0 auto;
  }
  h3 {
    margin-bottom: 5px;
  }
  .step {
    display: block;
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
.list-item {
  button {
    margin-right: -47px;
  }
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
  &.link {
    display: inline-block;
    font-size: 16px;
    background-color: transparent;
    color: darken(skyblue, 10%);
    border-radius: 0;
    padding: 0;
    border-bottom: 1px solid;
    &:hover {
      color: skyblue;
    }
    + .link {
      margin-left: 15px;
    }
    &.active {
      color: black;
      border-bottom-color: transparent;
    }
  }
}
.results .characteristics {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  padding-top: 10px;
  div {
    box-sizing: border-box;
    padding: 10px 15px;
    min-width: 33%;
    font-size: 16px;
    white-space: nowrap;
  }
}
</style>
