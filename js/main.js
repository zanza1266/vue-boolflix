// cfbf97edc4875500dc2f4461f936f5f6



const vm = new Vue ({
  el: '#root',
  data: {
    genres: [],
    show: true,
    category: 'film',
    currentCategory: '',
    userSearch: '',
    actualSearch: '',
    noResultsFounded: false,
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
    selectedPage: null,
    stars: [],
    showCast: [],
    id:'',
    castVisibility: false
  },
  mounted: function () {
    axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
      }
    })
    .then((res) =>{
      console.log(res);
      this.genres = [...res.data.genres]
    })
  },
  methods: {

    search: function () {

      // salvo la stringa di 'data.userSearch' in una proprietà di {data} così da mantenerla statica, e riferirla alle query che si attivano quando eventualmente l'utente cambia pagina dalla pagination bar (in caso venga digitato qualcosa di diverso nella barra di ricerca, il cambio di pagina dei film farà riferimento sempre alla stringa di ricerca originaria).
      let searched = this.userSearch;
      this.actualSearch = searched;

      if (this.actualSearch != '') {
        // replico l'operazione fatta con 'data.userSearch' per salvare 'data.category'.
        let selectedCategory = this.category;
        this.currentCategory = selectedCategory;

        // inizializzo la pagina da visualizzare ad 1 prima che si avvii la chiamata.
        this.selectedPage = 1

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

            this.generateStarsRate(res)
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
            this.generateStarsRate(res)
            this.manageDataOnSearch(res)
          })
        }
      }
    },

    manageDataOnSearch: function (callResult) {

      // stampo messaggio nel caso in cui la ricerca non abbia trovato risultati
      if (callResult.data.total_results == 0) {
        this.noResultsFounded = true;
      } else if (callResult.data.total_results > 0) {
        this.noResultsFounded = false;
      }

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
          this.displayedNav.push({pos: n, selected: false})
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
            this.displayedNav.push({pos: n, selected: false});
          }
        })
      } else if (this.selectedPage > 5) {

        this.arrayOfTotPages.forEach(n => {
          if ((n >= (this.selectedPage-4)) && (n <= (this.selectedPage+5))) {
            this.displayedNav.push({pos: n, selected: false});
          }
        })
      }

    },

    changePage: function (num, index) {

      console.log(num);
      // aggiorno il numero di pagina selezionato in {data}
      this.selectedPage = num.pos;

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
          // console.log(res);
          this.generateStarsRate(res)
          this.manageDataOnPageSwitch(res)
        })




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
          this.generateStarsRate(res)
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
            this.generateStarsRate(res)
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
            this.generateStarsRate(res)
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
            this.generateStarsRate(res)
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
            this.generateStarsRate(res)
            this.manageDataOnPageSwitch(res)
          });
        }
      }
    },

    generateStarsRate: function (callResult) {

      // gestisce la generazione delle stelle in base al voto

      this.stars = [];
      callResult.data.results.forEach((e) =>{

        let vote = (e.vote_average / 2);
        vote = vote.toFixed(1);
        voteString = vote.toString();
        let voteArr = voteString.split('.');

        // estraggo il numero di stelle
        stars = parseInt(voteArr[0]);

        // estraggo la mezza stella (gli assegno valore 1 se presente o valore 0 se non presente)
        halfStar =  parseInt(voteArr[1]);
        if (halfStar >= 5) {
          halfStar = 1;
        } else {
          halfStar = 0;
        }
        // popolo l'array a cui farà riferimento ogni scheda per generare le rispettive stelle
        this.stars.push({stars: stars, halfStar: halfStar });
      })
    },

    flag: function (filmObj) {

      // gestisce la bandiera della lingua (se presente)
      let match = 'notFound'
      this.flags.forEach(e => {
        if (filmObj.original_language == e.lang) {
          match = e.src;
        }
      })
      return match;
    },

    showSearchBar: function () {
      this.show = false;
      console.log(this.show);
    },

    askCast: function (id) {
      console.log(id);

      // gestisce la visualizzazione del cast nella scheda del film
      this.id = id
      this.castVisibility = !this.castVisibility
      this.showCast = [];

      axios.get(`https://api.themoviedb.org/3/movie/${id}/credits`, {
        params: {
          api_key: 'cfbf97edc4875500dc2f4461f936f5f6'
        }
      })
      .catch((error) =>{
        console.log(error.response);
        if (error.response.status == 404) {
          this.showCast.push('non disponibile')
        }
      })
      .then((res) =>{

        if (res.data.cast.length == 0) {
          this.showCast.push('non disponibile')
        } else {
          res.data.cast.forEach((e, index) =>{

            if (index < 5) {
              // console.log(e.name)
              this.showCast.push(e.name)
            }
          })
        }
      })

    },

    mouseleave: function () {
      this.castVisibility = false
    },

    matchGenres: function (gen) {

      // gestisce l'assegnazione dei generi ad ogni scheda film
      console.log(gen);

      let genresString = '';

      if (gen.length == 0) {
        return 'Non disponibile'
      } else {
        gen.forEach((e) =>{
          this.genres.forEach((el) => {
            if (e == el.id) {
              genresString += `${el.name}, `
            }
          })
        })
      }
      let fixedString = genresString.substring(0,genresString.length-2);

      return fixedString;
    }
  }
})
