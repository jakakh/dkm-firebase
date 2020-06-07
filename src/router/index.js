import Vue from "vue";
import VueRouter from "vue-router";
import firebase from 'firebase';

import Home from "../components/Home.vue";
import Dashboard from "../views/Dashboard.vue";
import SettingIdentitas from "../views/Setting/SettingIdentitas.vue";
import JabatanData from "../views/Pengurus/JabatanData.vue";
import PengurusData from "../views/Pengurus/PengurusData.vue";
import KategoriPemasukanData from "../views/MasterData/KategoriPemasukanData.vue";
import KategoriPengeluaranData from "../views/MasterData/KategoriPengeluaranData.vue";
import Pemasukan from "../views/Keuangan/Pemasukan.vue";
import Pengeluaran from "../views/Keuangan/Pengeluaran.vue";
import Inventaris from "../views/Inventaris/Inventaris.vue";
import KalenderKegiatan from "../views/Agenda/KalenderKegiatan.vue";
import CashFlow from "../views/Laporan/CashFlow.vue";
import About from "../views/About.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: '/home',
    name: "Home",
    component: Home,
    children: [
      {
        path: '/home',
        name: 'Dashboard',
        component: Dashboard,
        meta: {
          title: 'Dashboard',
          requiresAuth: true
        }  
      },
      {
        path: '/setting-identitas',
        name: 'SettingIdentitas',
        component: SettingIdentitas,
        meta: {
          title: 'Setting Identitas Masjid',
          requiresAuth: true
        }  
      },
      {
        path: '/data-jabatan',
        name: 'JabatanData',
        component: JabatanData,
        meta: {
          title: 'Data Jabatan',
          requiresAuth: true
        }  
      },
      {
        path: '/data-pengurus',
        name: 'PengurusData',
        component: PengurusData,
        meta: {
          title: 'Struktur Pengurus',
          requiresAuth: true
        }  
      },
      {
        path: '/kalender-kegiatan',
        name: 'KalenderKegiatan',
        component: KalenderKegiatan,
        meta: {
          title: 'Kalender Kegiatan',
          requiresAuth: true
        }  
      },
      {
        path: '/keuangan-pemasukan',
        name: 'Pemasukan',
        component: Pemasukan,
        meta: {
          title: 'Pemasukan Kas',
          requiresAuth: true
        }  
      },
      {
        path: '/keuangan-pengeluaran',
        name: 'Pengeluaran',
        component: Pengeluaran,
        meta: {
          title: 'Pengeluaran Kas',
          requiresAuth: true
        }  
      },
      {
        path: '/data-inventaris',
        name: 'Inventaris',
        component: Inventaris,
        meta: {
          title: 'Data Inventaris',
          requiresAuth: true
        }  
      },
      {
        path: '/data-kategori-pemasukan',
        name: 'KategoriPemasukanData',
        component: KategoriPemasukanData,
        meta: {
          title: 'Data Kategori Pemasukan Kas',
          requiresAuth: true
        }  
      },
      {
        path: '/data-kategori-pengeluaran',
        name: 'KategoriPengeluaranData',
        component: KategoriPengeluaranData,
        meta: {
          title: 'Data Kategori Pengeluaran Kas',
          requiresAuth: true
        }  
      },
      {
        path: '/laporan-cashflow',
        name: 'CashFlow',
        component: CashFlow,
        meta: {
          title: 'Cash Flow',
          requiresAuth: true
        }  
      },
      {
        path: '/about',
        name: 'About',
        component: About,
        meta: {
          title: 'About',
          requiresAuth: true
        }  
      }
    ],  
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: {
      title: 'Login'
    }      
  },
  {
    path: "/sign-up",
    name: "Register",
    component: Register,
    meta: {
      title: 'Register'
    }      
  } 
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

router.beforeEach((to, from, next) => {
  const currentUser = firebase.auth().currentUser;
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);

  if (requiresAuth && !currentUser) next('login');
  else if (!requiresAuth && currentUser) next('home');
  else next();
});

export default router;
