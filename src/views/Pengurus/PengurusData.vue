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
          <div class="input-group-append">
            <button class="input-group-text" data-toggle="modal" data-target="#tambahModal"><i class="fa fa-plus"></i></button>
          </div>
        </div>
      </div>
      <table class="table table-bordered table-hover table-sm nowrap" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>NAMA</th>
            <th>JABATAN</th>
            <th class="text-center" width="100">#</th>
          </tr>
        </thead>
        <tbody>
          <p v-if="loading">Loading...</p>
          <tr v-for="row in paginatedData" :key="row.id" >
            <td>{{ row.nama }}</td>
            <td>{{ row.jabatan.nama_jabatan }}</td>
            <td class="text-center">
              <button class="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#exampleModal" @click="editData(row.id, row.nama, row.jabatan)"><i class="fa fa-pencil-alt"></i></button>&nbsp;&nbsp;&nbsp;
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
    </div>
    <!-- Tambah -->
    <div class="modal fade" id="tambahModal" tabindex="-1" role="dialog" aria-labelledby="tambahModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="media-header">
            Tambah {{ this.$route.meta.title }}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">Nama</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="add.nama" required>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">Jabatan</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="add.jabatan" required>
                  <option v-for="row in listJabatan" :key="row.id" :value="row">{{ row.nama_jabatan }}</option>
                </select>  
              </div>
            </div>
          </div>  
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-sm" @click="simpanData()" data-dismiss="modal" aria-label="Close">Simpan</button>
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;Batal&nbsp;&nbsp;</button>
          </div>
        </div>
      </div>
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
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">Nama</label>
              <div class="col-sm-8">
                <input type="text" class="form-control" v-model="details.nama" required>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-4 col-form-label">Jabatan</label>
              <div class="col-sm-8">
                <select class="form-control" v-model="details.jabatan" required>
                  <option v-for="row in listJabatan" :key="row.id" :value="row">{{ row.nama_jabatan }}</option>
                </select>  
              </div>
            </div>
          </div>  
          <div class="modal-footer">
            <button type="button" class="btn btn-primary btn-sm" @click="updateData(details.id)" data-dismiss="modal" aria-label="Close">Update</button>
            <button type="button" class="btn btn-secondary btn-sm" data-dismiss="modal" aria-label="Close">&nbsp;&nbsp;Batal&nbsp;&nbsp;</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'JabatanData',
    data () {
      return {
        lists: [],
        errorsText: null,
        cari: '',
        pageNumber: 0,
        loading: true,
        add : {
          nama: '',
          jabatan: '',
          _token: ''
        },
        details : {
          id: '',
          nama: '',
          jabatan: '',
          _token: ''
        },
        hapus : {
          id: '',
          _token: ''
        },
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
      this.getData()
      this.getJabatan()
    },
    methods: {
      getData (){
        this.loading =true
        this.lists = []
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection('pengurus')
        .orderBy('jabatan.level', 'asc')
        .get()
        .then(querySnapshot => {
          this.lists = []
          querySnapshot.forEach(doc => {
            let pengurus = doc.data()
            pengurus.id = doc.id
            this.lists.push(pengurus)
          })
        this.loading = false
        }).catch ((err) => {
          this.errorText = err;
        })
      },
      simpanData () {
        firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("pengurus")
        .add({
            nama: this.add.nama.toUpperCase(),
            jabatan: this.add.jabatan,
        })
        this.toastSukses('Data berhasil ditambahkan!')
        this.getData()
        this.add = []
      },
      editData (id, nama, jabatan) {
        this.details.id = id
        this.details.nama = nama
        this.details.jabatan = jabatan
      },
      updateData (id) {
        firebase.firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection('pengurus')
          .doc(id)
          .set({
            nama: this.details.nama.toUpperCase(),
            jabatan: this.details.jabatan,
          }).then(() => {
            this.toastSukses('Data berhasil diupdate!')
            this.details = []
            this.getData()
        })
        .catch((error) => {
          alert("Error updating document: ", error);
        })
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
            .collection('jabatan')
            .doc(id).delete().then(() => {
              this.toastSukses('Data berhasil dihapus!')
              this.getData()
            }).catch((error) => {
              alert("Error removing document: ", error);
            })
          }
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
            event.nama.toLowerCase().includes(filterValue)        
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