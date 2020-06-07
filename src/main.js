import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import firebase from './Firebase.js'
import "bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.css";
import "@fortawesome/fontawesome-free/js/all.js";
import Vue2PerfectScrollbar from "vue2-perfect-scrollbar";
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';
import DatePicker from 'vue2-datepicker';
import 'vue2-datepicker/index.css';
import "./assets/css/style.css";

Vue.config.productionTip = false
let app = '';
Vue.use(Vue2PerfectScrollbar, {
  name: 'scroll'
})
Vue.use(VueSweetalert2);
Vue.use(DatePicker);
var d = new Date();
var appYear = d.getFullYear();
Vue.prototype.$app = {
  AppNameShort: 'SIMDKM',
  AppName: 'Sistem Informasi Manajemen DKM',
  Web: 'https://alkarizma.com',
  Tag: 'Alkarizma',
  TagWeb: 'https://alkarizma.com',
  Version: '0.1.0',
  Year: appYear,
}
Vue.directive('title', {
  inserted: (el,binding) => document.title = binding.value,
  update: (el,binding) => document.title = binding.value
})

Vue.mixin({
  data () {
    return {
      listJabatan: [],
      listKategoriPemasukan: [],
      listKategoriPengeluaran: []
  }
  },  
  methods: {
    isNumber: function(evt) {
      evt = (evt) ? evt : window.event;
      var charCode = (evt.which) ? evt.which : evt.keyCode;
      if ((charCode > 31 && (charCode < 48 || charCode > 57)) && charCode !== 46) {
        evt.preventDefault();
      } else {
        return true;
      }
    },
    toastSukses(text) {
      this.$swal({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        icon: 'success',
        title: text,
        onOpen: (toast) => {
          toast.addEventListener('mouseenter', this.$swal.stopTimer)
          toast.addEventListener('mouseleave', this.$swal.resumeTimer)
        }
      })
    },
    getJabatan (){
      this.listJabatan = []
      firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection('jabatan')
      .orderBy('level', 'asc')
      .get()
      .then(querySnapshot => {
        this.listJabatan = []
        querySnapshot.forEach(doc => {
          let jabatan = doc.data()
          jabatan.id = doc.id
          this.listJabatan.push(jabatan)
        })
      }).catch ((err) => {
        this.errorText = err;
      })
    },
    getKategoriPemasukan (){
      this.listKategoriPemasukan = []
      firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection('kategori_pemasukan')
      .orderBy('nama_kategori', 'asc')
      .get()
      .then(querySnapshot => {
        this.listKategoriPemasukan = []
        querySnapshot.forEach(doc => {
          let kategori = doc.data()
          kategori.id = doc.id
          this.listKategoriPemasukan.push(kategori)
        })
      }).catch ((err) => {
        this.errorText = err;
      })
    },
    getKategoriPengeluaran (){
      this.listKategoriPengeluaran = []
      firebase.firestore()
      .collection("users")
      .doc(firebase.auth().currentUser.uid)
      .collection('kategori_pengeluaran')
      .orderBy('nama_kategori', 'asc')
      .get()
      .then(querySnapshot => {
        this.listKategoriPengeluaran = []
        querySnapshot.forEach(doc => {
          let kategori = doc.data()
          kategori.id = doc.id
          this.listKategoriPengeluaran.push(kategori)
        })
      }).catch ((err) => {
        this.errorText = err;
      })
    },
  }
})

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      store,
      render: h => h(App),
    }).$mount('#app');
  }
});
