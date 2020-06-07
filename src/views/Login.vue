<template>
  <div class="container">
    <div class="row">
      <div class="col-sm-8 col-md-6 col-lg-4 mx-auto">
        <div class="card card-signin my-5">
          <div class="card-body">
            <h5 class="card-title text-center">Login</h5>
            <div v-if="error" class="alert alert-danger alert-dismissible fade show">
              {{error}}
              <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <form class="form-horizontal" action="#" @submit.prevent="login">
              <div class="input-group my-4">
                <div class="input-group-prepend">
                  <span class="input-group-text"><i class="fa fa-envelope"></i></span>
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
              <button class="btn btn-primary btn-block" type="submit">Login</button>
            </form>
            <!-- <div class="text-center my-4">-- Atau --</div>
            <button class="btn btn-google btn-block" @click.prevent="loginGoogle"><i class="fab fa-google mr-2"></i> Login dengan Google</button> -->
            <p class="text-center mt-4">Belum punya akun ? Silahkan <router-link to="/sign-up"><b>Daftar</b></router-link></p>
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
    name: 'Login',
    data() {
      return {
        email: '',
        password: '',
        error: null,
        passwordFieldType: 'password'
      }
    },
    methods: {
      login: function() {
        firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(
        () => {
          this.$router.replace('home')
        }).catch((err) => {
          this.error = err.message
        })  
      },
      loginGoogle: function() {
        const provider = new firebase.auth.GoogleAuthProvider()
        firebase.auth().signInWithPopup(provider).then(() => {
          this.$router.replace('home')
        }).catch((err) => {
          this.error = err.message
        })  
      },
      switchVisibility() {
        this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password'
      }
    }
  }
</script>