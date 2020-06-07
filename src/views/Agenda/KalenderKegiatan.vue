<template>
  <div class="media">
    <div class="media-header">
      <i class="fa fa-align-justify"></i> {{ this.$route.meta.title }}
    </div>
    <div class="media-body table-responsive">
      <div class="row mb-3">
        <div class="input-group-append col-md-3">
          <select class="form-control"  v-model="bulan" @change="getData()" required>
            <option value="01">Januari</option>
            <option value="02">Februari</option>
            <option value="03">Maret</option>
            <option value="04">April</option>
            <option value="05">Mei</option>
            <option value="06">Juni</option>
            <option value="07">Juli</option>
            <option value="08">Agustus</option>
            <option value="09">September</option>
            <option value="10">Oktober</option>
            <option value="11">Nopember</option>
            <option value="12">Desember</option>
          </select>  
        </div>  
        <div class="input-group-append col-md-2">
          <select class="form-control" v-model="tahun" @change="getData()" required>
            <option :value="thn(new date(), 'YYYY') - 5">{{ thn(new date(), 'YYYY') - 5 }}</option>
            <option :value="thn(new date(), 'YYYY') - 4">{{ thn(new date(), 'YYYY') - 4 }}</option>
            <option :value="thn(new date(), 'YYYY') - 3">{{ thn(new date(), 'YYYY') - 3 }}</option>
            <option :value="thn(new date(), 'YYYY') - 2">{{ thn(new date(), 'YYYY') - 2 }}</option>
            <option :value="thn(new date(), 'YYYY') - 1">{{ thn(new date(), 'YYYY') - 1 }}</option>
            <option :value="thn(new date(), 'YYYY')">{{ thn(new date(), 'YYYY') }}</option>
            <option :value="parseInt(thn(new date(), 'YYYY')) + 1">{{ parseInt(thn(new date(), 'YYYY')) + 1 }}</option>
            <option :value="parseInt(thn(new date(), 'YYYY')) + 2">{{ parseInt(thn(new date(), 'YYYY')) + 2 }}</option>
          </select>  
        </div>
        <button class="input-group-text" data-toggle="modal" data-target="#tambahModal"><i class="fa fa-plus"></i></button>
      </div>
      {{ errorsText }}
      <table class="table table-bordered table-hover table-sm nowrap" cellspacing="0" width="100%">
        <thead>
          <tr>
            <th>HARI / TANGGAL</th>
            <th>JAM</th>
            <th>NAMA KEGIATAN</th>
            <th>KETERANGAN</th>
            <th class="text-center" width="100">#</th>
          </tr>
        </thead>
        <tbody>
          <p v-if="loading">Loading...</p>
          <tr v-for="row in paginatedData" :key="row.id" >
            <td>{{ date(row.tanggal) }}</td>
            <td>{{ row.jam_mulai + ' s.d ' + row.jam_selesai }}</td>
            <td>{{ row.nama_kegiatan }}</td>
            <td>{{ row.keterangan }}</td>
            <td class="text-center">
              <button class="btn btn-outline-success btn-sm" data-toggle="modal" data-target="#exampleModal" @click="editData(row.id, row.tanggal, row.jam_mulai, row.jam_selesai, row.nama_kegiatan, row.keterangan)"><i class="fa fa-pencil-alt"></i></button>&nbsp;&nbsp;&nbsp;
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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="media-header">
            Tambah {{ this.$route.meta.title }}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Tanggal</label>
              <div class="col-sm-2">
                <date-picker v-model="add.tanggal" :editable="false" format="YYYY-MM-DD" value-type="format" type="date" required></date-picker>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Jam</label>
              <div class="col-sm-4">
                <date-picker v-model="add.jam_mulai" format="HH:mm" value-type="format" :editable="false" type="time" required></date-picker>
              </div>
              <label class="col-sm-1 col-form-label">s.d</label>
              <div class="col-sm-4">
                <date-picker v-model="add.jam_selesai" format="HH:mm" value-type="format" :editable="false" type="time" required></date-picker>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Nama Kegiatan</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" v-model="add.nama_kegiatan" required>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Keterangan</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" v-model="add.keterangan" required>
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
      <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="media-header">
            Edit {{ this.$route.meta.title }}
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">           
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Tanggal</label>
              <div class="col-sm-2">
                <date-picker v-model="details.tanggal" :editable="false" format="YYYY-MM-DD" value-type="format" type="date" required></date-picker>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Jam</label>
              <div class="col-sm-4">
                <date-picker v-model="details.jam_mulai" format="HH:mm" value-type="format" :editable="false" type="time" required></date-picker>
              </div>
              <label class="col-sm-1 col-form-label">s.d</label>
              <div class="col-sm-4">
                <date-picker v-model="details.jam_selesai" format="HH:mm" value-type="format" :editable="false" type="time" required></date-picker>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Nama Kegiatan</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" v-model="details.nama_kegiatan" required>
              </div>
            </div>
            <div class="form-group row">
              <label class="col-sm-2 col-form-label">Keterangan</label>
              <div class="col-sm-10">
                <input type="text" class="form-control" v-model="details.keterangan" required>
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
  import moment from "moment"

  export default {
    name: 'KalenderKegiatan',
    data () {
      return {
        lists: [],
        errorsText: null,
        cari: '',
        pageNumber: 0,
        loading: true,
        bulan: '',
        tahun: '',
        add : {
          tanggal: new Date(),
          jam_mulai: '',
          jam_selesai: '',
          nama_kegiatan: '',
          keterangan: '',
          _token: ''
        },
        details : {
          id: '',
          tanggal: '',
          jam_mulai: '',
          jam_selesai: '',
          nama_kegiatan: '',
          keterangan: '',
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
      this.bulan = this.bln(new Date(), 'MM')  
      this.tahun = this.thn(new Date())  
      this.getData()
      this.getKategoriPemasukan()
    },
    methods: {
      date: function (date) {
        moment.locale('id');
        return moment(date).format('dddd, Do MMMM YYYY');
      },
      bln: function (date, format) {
        moment.locale('id');
        return moment(date).format(format);
      },
      thn: function (date) {
        moment.locale('id');
        return moment(date).format('YYYY');
      },
      getData (){
        this.loading =true
        this.lists = []
        var tgl_awal = this.tahun + "-" + this.bulan + "-01"
        var tgl_akhir = this.tahun + "-" + this.bulan + "-30"
        var citiesRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid).collection('agenda')
        citiesRef
        .where("tanggal", ">=", tgl_awal)
        .where("tanggal", "<=", tgl_akhir)
        .orderBy("tanggal", "asc")
        .orderBy("jam_mulai", "asc")
        .onSnapshot((querySnapshot) => {
          this.lists = []
          querySnapshot.forEach((doc) => {
            let inventaris = doc.data()
            inventaris.id = doc.id
            this.lists.push(inventaris)
          })
        })
        this.loading = false
      },
      simpanData () {
        firebase
        .firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .collection("agenda")
        .add({
          tanggal: this.add.tanggal,
          jam_mulai: this.add.jam_mulai,
          jam_selesai: this.add.jam_selesai,
          nama_kegiatan: this.add.nama_kegiatan,
          keterangan: this.add.keterangan,
        })
        this.toastSukses('Data berhasil ditambahkan!')
        this.getData()
        this.add = []
      },
      editData (id, tanggal, jam_mulai, jam_selesai, nama_kegiatan, keterangan) {
        this.details.id = id
        this.details.tanggal = tanggal
        this.details.jam_mulai = jam_mulai
        this.details.jam_selesai = jam_selesai
        this.details.nama_kegiatan = nama_kegiatan
        this.details.keterangan = keterangan
      },
      updateData (id) {
        firebase.firestore()
          .collection("users")
          .doc(firebase.auth().currentUser.uid)
          .collection('agenda')
          .doc(id)
          .set({
          tanggal: this.details.tanggal,
          jam_mulai: this.details.jam_mulai,
          jam_selesai: this.details.jam_selesai,
          nama_kegiatan: this.details.nama_kegiatan,
          keterangan: this.details.keterangan,
          }).then(() => {
            this.toastSukses('Data berhasil diupdate!')
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
            .collection('agenda')
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
            event.nama_kegiatan.toLowerCase().includes(filterValue)        
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