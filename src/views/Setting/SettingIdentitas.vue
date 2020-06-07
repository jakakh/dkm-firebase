<template>
  <form class="form-horizontal" action="#" @submit.prevent="updateData">
    <div class="media">
      <div class="media-header">
        <i class="fa fa-align-justify"></i> {{ this.$route.meta.title }}    
        <button type="button" class="close" @click="backForm">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>  
      <p v-if="loading">Loading...</p>
      <div class="media-body" v-if="!loading">
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Nama Masjid</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="details.nama_masjid" required autofocus>
          </div>
        </div>
        <div class="form-group row">
          <label class="col-sm-2 col-form-label">Alamat Masjid</label>
          <div class="col-sm-10">
            <input type="text" class="form-control" v-model="details.alamat_masjid" required>
          </div>
        </div>
      </div>
      <div class="media-footer">
        <button type="submit" class="btn btn-primary">Update</button>
      </div>  
    </div>
  </form>
</template>

<script>
  import firebase from '../../Firebase'
  
  export default {
    name: 'SettingIdentitas',
    data () {
      return {
        key: '',
        details: [],
        errorsText: null,
        error: [],
        loading: true
      }
    },
    created() {
      this.tampilData()
    },
    methods: {
      backForm () {
        this.$router.replace('/')
      },
      tampilData (){
        this.details = []
        this.loading = true
        const ref = firebase.firestore()
                  .collection("users")
                  .doc(firebase.auth().currentUser.uid)
                  .collection('identitas').doc('1')
        ref.get().then((doc) => {
          if (doc.exists) {
            this.key = doc.id;
            this.details = doc.data()
            this.loading = false
          } else {
            this.addData()
          }
        })
      },      
      updateData () {
        firebase.firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection('identitas')
          .doc('1')
          .set({
            nama_masjid: this.details.nama_masjid,
            alamat_masjid: this.details.alamat_masjid,
          }).then(() => {
            this.toastSukses('Data berhasil diupdate!')
            this.tampilData()
        })
        .catch((error) => {
          alert("Error updating document: ", error);
        })
      },
      addData () {
        firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("identitas").doc('1')
        .set({
            nama_masjid: 'Nama Masjid',
            alamat_masjid: 'Alamat Masjid',
        })
        this.tampiltData()
        this.add = []
      },

    },
  }
</script>