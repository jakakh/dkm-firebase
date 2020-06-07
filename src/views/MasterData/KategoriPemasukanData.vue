<template>
  <div class="media">
    <div class="media-header">
      <i class="fa fa-align-justify"></i> {{ this.$route.meta.title }}    
    </div>  
    <div class="media-body table-responsive">
      <div class="row">
        <div class="input-group mb-3 col-md-4">
          <input type="text" class="form-control" placeholder="Search..." v-model="cari">
          <div class="input-group-append">
            <button class="input-group-text" @click="getData"><i class="fa fa-search"></i></button>
          </div>
        </div>
      </div>
      <table class="table table-bordered table-hover table-sm nowrap" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th >NAMA KATEGORI</th>
            <th class="text-center" width="100">#</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>                           
              <input class="form-control" v-model="add.nama_kategori"  @keyup.enter="addData"/>
            </td>
            <td class="text-center" width="100"><button class="btn btn-outline-primary btn-sm" type="button" @click="addData"><i class="fa fa-save"></i></button></td>
          </tr>
          <p v-if="loading">Loading...</p>
          <tr v-for="row in paginatedData" :key="row.id" >
            <td>{{ row.nama_kategori }}</td>
            <td class="text-center">
              <button class="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#exampleModal" @click="editData(row.id)"><i class="fa fa-pencil-alt"></i></button>&nbsp;&nbsp;&nbsp;
              <button class="btn btn-outline-danger btn-sm" type="button" @click="deleteData(row.id)"><i class="fa fa-trash"></i></button>
            </td>
          </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation" v-show="this.searchLists.length > this.size">
        <ul class="pagination pagination-sm justify-content-end">
          <li class="page-item" :class="{'disabled': pageNumber == 0}"><a class="page-link" href="#" @click.prevent="firstPage">First</a></li>
          <li class="page-item" :class="{'disabled': pageNumber == 0}"><a class="page-link" href="#" @click.prevent="prevPage">Prev</a></li>
          <li class="page-item" :class="{'disabled': pageNumber >= pageCount -1}"><a class="page-link" href="#" @click.prevent="nextPage">Next</a></li>
          <li class="page-item" :class="{'disabled': pageNumber >= pageCount -1}"><a class="page-link" href="#" @click.prevent="lastPage">Last</a></li>
        </ul>
      </nav>        
      {{ errorText }} 
    </div>
    <!-- Edit -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="media-header">
            Edit {{ this.$route.meta.title }}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <input class="form-control" v-model="details.nama_kategori"/>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-sm" @click="updateData(details.id)" data-dismiss="modal" aria-label="Close">Update</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from '../../Firebase'
  export default {
    name: 'KategoriPemasukanData',
    data () {
      return {
        lists: [],
        add: [],
        details:[],
        errorsText: null,
        error: [],
        cari: '',
        pageNumber: 0,
        loading: true
      }
    },
    props:{
        size:{
          type:Number,
          required:false,
          default: 10
        }
    },
    created() {
      this.getData();
    },
    methods: {
      getData (){
        this.loading =true
        this.lists = []
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection('kategori_pemasukan')
        .orderBy('nama_kategori', 'asc')
        .get()
        .then(querySnapshot => {
          this.lists = []
          querySnapshot.forEach(doc => {
            let kategori = doc.data()
            kategori.id = doc.id
            this.lists.push(kategori)
          })
          this.loading = false
        }).catch ((err) => {
          this.errorText = err;
        })
      },
      addData () {
        firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("kategori_pemasukan")
        .add({
            nama_kategori: this.add.nama_kategori.toUpperCase(),
        })
        this.toastSukses('Data berhasil ditambahkan!')
        this.getData()
        this.add = []
      },
      deleteData(id) {
        this.$swal({
          title: 'Apakah anda yakin ingin menghapusnya?',
          text: "Data yang sudah dihapus tidak bisa dikembalikan!",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Ya, hapus!',
          cancelButtonText: 'Tidak, batalkan!'
        })
        .then((result) => {
          if (result.value) {
            firebase.firestore()
            .collection("users")
            .doc(firebase.auth().currentUser.uid)
            .collection('kategori_pemasukan')
            .doc(id).delete().then(() => {
              this.toastSukses('Data berhasil dihapus!')
              this.getData()
            }).catch((error) => {
              alert("Error removing document: ", error);
            })
          }
        })
      },
      editData (id) {
        const ref = firebase.firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection('kategori_pemasukan')
          .doc(id)
        ref.get().then((doc) => {
          if (doc.exists) {
            let detail = doc.data()
            detail.id = doc.id
            this.details = detail;
          } else {
            alert("No such document!");
          }
        })
      },
      updateData (id) {
        firebase.firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection('kategori_pemasukan')
          .doc(id)
          .set({
            nama_kategori: this.details.nama_kategori.toUpperCase(),
          }).then(() => {
            this.toastSukses('Data berhasil diupdate!')
            this.details = []
            this.getData()
        })
        .catch((error) => {
          alert("Error updating document: ", error);
        })
      },
      firstPage(){
        this.pageNumber = 0
      },
      nextPage(){
        this.pageNumber++
      },
      prevPage(){
        this.pageNumber--
      }, 
      lastPage(){
        this.pageNumber = this.pageCount - 1
      }
    },
    computed: {
      searchLists: function(){
        let result = this.lists
        if (!this.cari)
          return result
        
        const filterValue = this.cari.toLowerCase()

        const filter = event => 
            event.nama_kategori.toLowerCase().includes(filterValue)        
        return result.filter(filter)
      },
      pageCount(){
            let l = this.searchLists.length,
                s = this.size;
            return Math.ceil(l/s);
      },
      paginatedData(){
          const start = this.pageNumber * this.size,
                end = start + this.size;
          return this.searchLists.slice(start, end);
      }
    }
  }
</script>