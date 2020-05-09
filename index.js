const db = firebase.firestore();
const itemsRef = db.collection('tasks');

Vue.component('item', {
  props: ['item', 'i'],
  template: `<span @click="toggleItem" class="item"><img :src="getSrc" class="item-icon"><span :class="{done: this.item.done}">{{item.task}}</span><i class="fas fa-trash" @click="deleteItem"></i></span>`,
  computed: {
    getSrc() {
      if (this.item.done && this.i%2==0) {
        return `./assets/yay.jpg`
      } else if (this.item.done && this.i%2==1) {
        return `./assets/yay_sis.jpg`
      } else if (!this.item.done && this.i%2==0) {
        return `./assets/nope.jpg`
      } else if (!this.item.done && this.i%2==1) {
        return `./assets/nope_sis.jpg`
      }
    }
  },
  methods: {
    toggleItem() {
      this.item.done = !this.item.done;
      itemsRef.doc(this.item.id).update({
        done: this.item.done
      })
    },
    deleteItem() {
      this.$emit('delete-item', this.item)
    }
  }
})

let app = new Vue({
  el: '#app',
  data: {
    items: [],
    newItem: ""
  },
  methods: {
    addItem() {
      if (this.newItem != "") {
        let id = itemsRef.doc().id;
        itemsRef.doc(id).set({
          id: id,
          task: this.newItem,
          done: false,
          timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        this.newItem = ""
      }
    },
    deleteDone() {
      let done = this.items.filter(item => item.done);
      for (item of done) {
        itemsRef.doc(item.id).delete()
        .then(() => {console.log('deleted')})
        .catch(err => {console.log(err)})
      }
    },
    deleteItem(item) {
      itemsRef.doc(item.id).delete()
      .then(()=>{console.log('deleted')})
      .catch(err=>{console.log(err)})
    }
  },
  mounted() {
    itemsRef.orderBy('timestamp', 'asc').onSnapshot(querySnap => {
      this.items = querySnap.docs.map(doc => doc.data())
    })
  }
})