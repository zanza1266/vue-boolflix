// cfbf97edc4875500dc2f4461f936f5f6



const vm = new Vue ({
  el: '#root',
  data: {
    category: 'film',
    currentCategory: '',

    userSearch: '',
    actualSearch: '',
    filmsInPage: [],
    flags: [
      {
        src: 'img/flags/china.svg',
        lang: 'zh'
      },
      {
        src: 'img/flags/denmark.svg',
        lang: 'da'
      },
      {
        src: 'img/flags/england.svg',
        lang: 'en'
      },
      {
        src: 'img/flags/france.svg',
        lang: 'fr'
      },
      {
        src: 'img/flags/germany.svg',
        lang: 'de'
      },
      {
        src: 'img/flags/italy.svg',
        lang: 'it'
      },
      {
        src: 'img/flags/japan.svg',
        lang: 'ja'
      },
      {
        src: 'img/flags/portugal.svg',
        lang: 'pt'
      },
      {
        src: 'img/flags/romania.svg',
        lang: 'ro'
      },
      {
        src: 'img/flags/russia.svg',
        lang: 'ru'
      },
      {
        src: 'img/flags/spain.svg',
        lang: 'es'
      },
      {
        src: 'img/flags/sweden.svg',
        lang: 'sv'
      },
    ],

    arrayOfTotPages: [],
    displayedNav: [],
    selectedPage: null
  },
  methods: {

    search: function () {

      // salvo la stringa di 'data.userSearch' in una proprietà di {data} così da mantenerla statica, e riferirla alle query che si attivano quando eventualmente l'utente cambia pagina dalla pagination bar (in caso venga digitato qualcosa di diverso nella barra di ricerca, il cambio di pagina dei film farà riferimento sempre alla stringa di ricerca originaria).
      let searched = this.userSearch;
      this.actualSearch = searched;

      // replico l'operazione fatta con 'data.userSearch' per salvare 'data.category'.
      let selectedCategory = this.category;
      this.currentCategory = selectedCategory;


      // inizializzo la pagina da visualizzare ad 1 prima che si avvii la chiamata.
      this.selectedPage = 1;

      // gestisco la chiamata se categoria è film
      if (this.currentCategory == 'film') {
        axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
            query: this.userSearch,
            page: 1
          }
        })
        .then((res) => {
          console.log(res);

          this.manageDataOnSearch(res)
        });
      }
      // gestisco la chiamata se categoria è serie
      if (this.currentCategory == 'serie') {
        axios.get('https://api.themoviedb.org/3/search/tv', {
          params: {
            api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
            query: this.userSearch,
            page: 1
          }
        })
        .then((res) => {
          console.log(res);

          this.manageDataOnSearch(res)
        })
      }

    },

    manageDataOnSearch: function (callResult) {
      // popolo l'array di film da visualizzare nella pagina selezionata
      this.filmsInPage = callResult.data.results

      // svuoto array delle pagine totali della ricerca e l'array delle pagine selezionabili nella navigation bar (funzionale principalmente in caso di nuova ricerca)
      this.arrayOfTotPages = [];
      this.displayedNav = [];

      // popolo array delle pagine totali
      for (let i = 1; i <= callResult.data.total_pages; i++) {
        this.arrayOfTotPages.push(i)
      }

      // popolo array delle pagine selezionabili
      this.arrayOfTotPages.forEach(n => {
        if (n <= 10) {
          this.displayedNav.push(n)
        }
      })
    },

    manageDataOnPageSwitch: function (callResult) {
      // popolo l'array di film da visualizzare nella pagina selezionata
      this.filmsInPage = callResult.data.results

      // svuoto array delle pagine totali della ricerca e l'array delle pagine selezionabili nella navigation bar (funzionale principalmente in caso di nuova ricerca)
      this.arrayOfTotPages = [];
      this.displayedNav = [];

      // popolo array delle pagine totali
      for (let i = 1; i <= callResult.data.total_pages; i++) {
        this.arrayOfTotPages.push(i)
      }


      // logica per ripopolare reattivamente l'array delle pagine selezionabili in base alla pagina verso la quale l'utente si è spostato (dalla pagina 6 in poi, sono visualizzabili sempre le 5 pagine successive e le 4 precedenti rispetto alla pagina selezionata)
      if (this.selectedPage <= 5) {
        this.arrayOfTotPages.forEach(n => {
          if (n <= 10) {
            this.displayedNav.push(n);
          }
        })
      } else if (this.selectedPage > 5) {

        this.arrayOfTotPages.forEach(n => {
          if ((n >= (this.selectedPage-4)) && (n <= (this.selectedPage+5))) {
            this.displayedNav.push(n);
          }
        })
      }
    },

    changePage: function (num, index) {
      console.log(event);
      console.log(num);
      // aggiorno il numero di pagina selezionato in {data}
      this.selectedPage = num;

      // gestisco la chiamata se categoria è film
      if (this.currentCategory == 'film') {
        axios.get('https://api.themoviedb.org/3/search/movie', {
          params: {
            api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
            query: this.actualSearch,
            page: this.selectedPage
          }
        })
        .then((res) => {
          console.log(res);

          this.manageDataOnPageSwitch(res)
        });
      }

      // gestisco la chiamata se categoria è serie
      if (this.currentCategory == 'serie') {
        axios.get('https://api.themoviedb.org/3/search/tv', {
          params: {
            api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
            query: this.actualSearch,
            page: this.selectedPage
          }
        })
        .then((res) => {
          console.log(res);

          this.manageDataOnPageSwitch(res)
        });
      }
    },

    switchFollowing: function () {

      // logica per avanzare di pagina con la freccia di destra
      if (this.selectedPage < this.arrayOfTotPages.length) {
        this.selectedPage += 1;

        // gestisco la chiamata se categoria è film
        if (this.currentCategory == 'film') {
          axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
              api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
              query: this.actualSearch,
              page: this.selectedPage
            }
          })
          .then((res) => {
            console.log(res);

            this.manageDataOnPageSwitch(res)
          });
        }

        // gestisco la chiamata se categoria è serie
        if (this.currentCategory == 'serie') {
          axios.get('https://api.themoviedb.org/3/search/tv', {
            params: {
              api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
              query: this.actualSearch,
              page: this.selectedPage
            }
          })
          .then((res) => {
            console.log(res);

            this.manageDataOnPageSwitch(res)
          });
        }
      }
    },

    switchPrevious: function () {

      // logica per retrocedere di pagina con la freccia di sinistra
      if (this.selectedPage > 1) {
        this.selectedPage -= 1;

        // gestisco la chiamata se categoria è film
        if (this.currentCategory == 'film') {
          axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
              api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
              query: this.actualSearch,
              page: this.selectedPage
            }
          })
          .then((res) => {
            console.log(res);

            this.manageDataOnPageSwitch(res)
          });
        }

        // gestisco la chiamata se categoria è serie
        if (this.currentCategory == 'serie') {
          axios.get('https://api.themoviedb.org/3/search/tv', {
            params: {
              api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
              query: this.actualSearch,
              page: this.selectedPage
            }
          })
          .then((res) => {
            console.log(res);

            this.manageDataOnPageSwitch(res)
          });
        }
      }
    },

    starRate: function (val) {
      let rounded = Math.round(val.vote_average / 2)
      // console.log(rounded);
      return rounded;
    },

    flag: function (filmObj) {

      // gestisce la bandiera della lingua (se presente)
      let match = ''
      this.flags.forEach(e => {
        if (filmObj.original_language == e.lang) {
          match = e.src;
        }
      })
      return match;
    },

  }
})
