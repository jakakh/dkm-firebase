<template>
  <div class="wrapper">
    <div class="fixed-top">
      <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container-fluid">
          <button type="button" id="sidebarCollapse" class="navbar-btn" @click.prevent="toggle" :class="{'active' : isSidebar}">
            <span></span>
            <span></span>
            <span></span>
          </button>
          <img src="../assets/images/logo3.png" height="30" />
          <button class="btn btn-default d-inline-block d-lg-none ml-auto" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <i class="fas fa-arrow-right"></i>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="nav navbar-nav ml-auto">
              <li class="nav-item">
                <div class="dropdown">
                  <a class="nav-link" type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <img src="../assets/images/profil.jpg" height="24" class="rounded" alt="User"> {{ user.displayName }}
                  </a>
                  <div class="dropdown-menu dropdown-menu-right" aria-labelledby="dropdownMenuButton">
                    <img class="card-img-top pl-2 pr-2 pb-2" src="../assets/images/profil.jpg" alt="Profil Image">
                    <h6 class="dropdown-header"><b>{{ user.displayName }}</b> <br/> {{ user.email }}</h6>
                    <div class="dropdown-divider"></div>
                    <a class="dropdown-item" href="#" @click="logout">Logout</a>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
      <nav id="sidebar"  :class="{'active' : isSidebar}">
        <div id="dismiss"  @click.prevent="toggle" :class="{'active' : isSidebar}">
          <i class="fas fa-arrow-left"></i>
        </div>
        <div class="sidebar-header">
          <img src="../assets/images/logo2.png" height="32" style="margin-left:10px;" />
        </div>
        <scroll ref="scroll" :options="options" :watch-options="watcher" class="sidebar-main">
          <ul class="list-unstyled components">
            <li :class="{'active' : currentRouteName == 'Dashboard'}" @click.prevent="toggle2">
              <router-link to="/home"><i class="fa fa-home"></i> Home</router-link>
            </li>
            <li>
              <a href="#pengurus" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-share-alt"></i> Data Pengurus</a>
              <ul class="collapse list-unstyled" id="pengurus">
                <li :class="{'active' : currentRouteName == 'JabatanData'}" @click.prevent="toggle2">
                  <router-link to="/data-jabatan"><i class="fa fa-folder"></i> Jabatan</router-link>
                </li>
                <li :class="{'active' : currentRouteName == 'PengurusData'}" @click.prevent="toggle2">
                  <router-link to="/data-pengurus"><i class="fa fa-folder"></i> Struktur Pengurus</router-link>
                </li>
              </ul>
            </li>
            <li :class="{'active' : currentRouteName == 'KalenderKegiatan'}" @click.prevent="toggle2">
              <router-link to="/kalender-kegiatan"><i class="fa fa-calendar"></i> Kalender Kegiatan</router-link>
            </li>
            <li>
              <a href="#keuangan" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-wallet"></i> Keuangan</a>
              <ul class="collapse list-unstyled" id="keuangan">
                <li :class="{'active' : currentRouteName == 'Pemasukan'}" @click.prevent="toggle2">
                  <router-link to="/keuangan-pemasukan"><i class="fa fa-folder"></i> Pemasukan Kas</router-link>
                </li>
                <li :class="{'active' : currentRouteName == 'Pengeluaran'}" @click.prevent="toggle2">
                  <router-link to="/keuangan-pengeluaran"><i class="fa fa-folder"></i> Pengeluaran Kas</router-link>
                </li>
              </ul>
            </li>
            <li :class="{'active' : currentRouteName == 'Inventaris'}" @click.prevent="toggle2">
              <router-link to="/data-inventaris"><i class="fa fa-tags"></i> Data Inventaris</router-link>
            </li>
            <li>
              <a href="#master" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-list-alt"></i> Laporan</a>
              <ul class="collapse list-unstyled" id="master">
                <li :class="{'active' : currentRouteName == 'CashFlow'}" @click.prevent="toggle2">
                  <router-link to="/laporan-cashflow"><i class="fa fa-folder"></i> Cash Flow</router-link>
                </li>
              </ul>
            </li>
            <li>
              <a href="#master" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-cubes"></i> Master Data</a>
              <ul class="collapse list-unstyled" id="master">
                <li :class="{'active' : currentRouteName == 'KategoriPemasukanData'}" @click.prevent="toggle2">
                  <router-link to="/data-Kategori-pemasukan"><i class="fa fa-folder"></i> Kategori Pemasukan Kas</router-link>
                </li>
                <li :class="{'active' : currentRouteName == 'KategoriPengeluaranData'}" @click.prevent="toggle2">
                  <router-link to="/data-kategori-pengeluaran"><i class="fa fa-folder"></i> Kategori Pengeluaran Kas</router-link>
                </li>
              </ul>
            </li>
            <li>
              <a href="#setting" data-toggle="collapse" aria-expanded="false" class="dropdown-toggle"><i class="fa fa-cogs"></i> Setting</a>
              <ul class="collapse list-unstyled" id="setting">
                <li :class="{'active' : currentRouteName == 'Identitas Masjid'}" @click.prevent="toggle2">
                  <router-link to="/setting-identitas"><i class="fa fa-folder"></i> Identitas Masjid</router-link>
                </li>
              </ul>
            </li>
          </ul>
        </scroll>
      </nav>
    </div>
    <div id="content" :class="{'active' : isSidebar}">
        <router-view></router-view>
    </div>
    <Footer />
    <div class="overlay" :class="{'active' : isSidebar}" @click.prevent="toggle" ></div>
  </div>  
</template>

<script>
import firebase from 'firebase';
import Footer from "../components/Footer.vue";

export default {
  name: "Home",
  data: () => ({
    isSidebar: false,
    options: {
      minScrollbarLength: 100
    },
    watcher: true,
    user: firebase.auth().currentUser
  }),
  methods: {
    toggle() {
      this.isSidebar = !this.isSidebar
    },
    toggle2() {
      if(screen.width < 768) {
        this.isSidebar = !this.isSidebar
      }
    },
    logout: function() {
      this.$swal({
        title: 'Logout Aplikasi?',
        text: '',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Ya, Logout!',
        cancelButtonText: 'Tidak, batalkan!'
      })
      .then((result) => {
        if (result.value) {
          firebase.auth().signOut().then(() => {
            this.$router.replace('login')
          })
        }
      })
    }
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    currentScreen() {
      return screen.width;
    },
  },
  components:{
    Footer
  }
};
</script>
<style>
.sidebar-main {
  position: relative;
  width: 230px;
  height: 100%;
  margin-top: -10px;
  overflow: hidden;
}
</style>
