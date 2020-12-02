/*Milestone 1: Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente. Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato: Titolo Titolo Originale Lingua Voto */


// cfbf97edc4875500dc2f4461f936f5f6



const vm = new Vue ({
  el: '#root',
  data: {
    userSearch: '',
    filmsInPage: [],
    page: 1
  },
  mounted () {},
  methods: {

    search: function () {
      axios.get('https://api.themoviedb.org/3/search/movie', {
        params: {
          api_key: 'cfbf97edc4875500dc2f4461f936f5f6',
          query: this.userSearch,
          page: this.page
        }
      })
      .then((res) => {
        console.log(res);
        this.filmsInPage = res.data.results
      });
    }
  }
})
