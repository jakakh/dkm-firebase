<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-9 col-md-7 col-lg-5 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Register</h5>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show">
              {{error}}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form class="form-horizontal" action="#" @submit.prevent="daftar">
              <div class="input-group my-4">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"><i class="fa fa-user"></i></span>
                </div>
                <input type="text" class="form-control" v-model="nama" placeholder="Nama Lengkap" required autofocus>
              </div>
              <div class="input-group my-4">
                <div class="input-group-prepend">
                  <span class="input-group-text" id="basic-addon1"><i class="fa fa-envelope"></i></span>
                </div>
                <input type="email" class="form-control" v-model="email" placeholder="Email" required autofocus>
              </div>
              <div class="input-group my-4" v-show="passwordFieldType === 'password'">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input :type="passwordFieldType" class="form-control right-border-none" v-model="password" placeholder="Password" required>
                <div class="input-group-append">
                  <span class="input-group-text transparent left-border-none" @click="switchVisibility"><i class="fa fa-eye"></i></span>
                </div>
              </div>
              <div class="input-group my-4"  v-show="passwordFieldType === 'text'">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-lock"></i></span>
                </div>
                <input :type="passwordFieldType" class="form-control right-border-none" v-model="password" placeholder="Password" required>
                <div class="input-group-append">
                  <span class="input-group-text transparent left-border-none" @click="switchVisibility"><i class="fa fa-eye-slash"></i></span>
                </div>
              </div>
              <button class="btn btn-primary btn-block" type="submit">Daftar</button>
            </form>
            <hr class="my-4">
            <div class="text-center">
              <small>
                <a :href="this.$app.Web"> {{ this.$app.AppName + ' ' + this.$app.Version }}</a>
                <span> &copy; {{ this.$app.Year }}.</span><br/>
                <span> Powered by</span>
                <a :href="this.$app.TagWeb"> {{ this.$app.Tag }}</a>
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'Register',
    data() {
      return {
        nama: '',
        email: '',
        password: '',
        error: null,
        passwordFieldType: 'password'
      }
    },
    methods: {
      daftar: function() {
        firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then(
        (data) => {
          data.user
            .updateProfile({
              displayName: this.nama
            })
            .then(() => {})
          this.toastSukses('Berhasil mendaftarkan akun!</br> Silahkan Login')  
          firebase.auth().signOut().then(() => {
            this.$router.replace('login')
          })
        }).catch((err) => {
          this.error = err.message
        })  
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
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
      }
    }
  }
</script>