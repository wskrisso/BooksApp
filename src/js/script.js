/* global Handlebars, utils, dataSource */ // eslint-disable-line no-unused-vars

{
  'use-strict';

  const select = {
    templateOf: {
      bookList: '#template-book',
    },
    containerOf: {
      list: '.books-list',
      filters: '.filters',
    },
    imageCover: {
      image: '.book__image',
    },
  };

  const templates = {
    bookList: Handlebars.compile(document.querySelector(select.templateOf.bookList).innerHTML),
  };

  class BooksList {
    constructor() {
      const thisBooksList = this;

      thisBooksList.favoriteBooks = [];
      thisBooksList.filters = [];

      thisBooksList.initData();
      thisBooksList.render();
      thisBooksList.getElements();
      thisBooksList.initAction();
    }

    initData(){
      const thisBooksList = this;
      thisBooksList.data = dataSource.books;
    }

    getElements(){
      const thisBooksList = this;
      thisBooksList.list = document.querySelector(select.containerOf.booksList);

    }

    initAction(){
        const thisBooksList = this;
              
  
        const allBooks = document.querySelector(select.containerOf.list);
  
        allBooks.addEventListener('dblclick', event => {
          if (event.target.offsetParent.classList.contains('book__image')){
            event.preventDefault();
            const coverId = event.target.offsetParent;
            const bookId = coverId.getAttribute('data-id');
            if (!thisBooksList.favoriteBooks.includes(bookId)) {
              coverId.classList.add('favorite');
              thisBooksList.favoriteBooks.push(bookId);
            } else {
              coverId.classList.remove('favorite');
              thisBooksList.favoriteBooks.remove(bookId);
            }
          }
  
        });
  
        /* const allBooks = document.querySelectorAll(select.imageCover.image); 
              
              for (let book of allBooks) {
                  book.addEventListener('dblclick', function (event) {
                      event.preventDefault();
                      const bookId = book.getAttribute('data-id');
                      if (!thisBooksList.favoriteBooks.includes(bookId)) {
                          book.classList.add('favorite');
                          thisBooksList.favoriteBooks.push(bookId);
                      } else {
                          book.classList.remove('favorite');
                          thisBooksList.favoriteBooks.remove(bookId);
                      }
              
                  });
              } */
          const filtersform = document.querySelector(select.containerOf.filters);
  
          filtersform.addEventListener('click', function (event) {
            const clickedElement = event.target;
            if (clickedElement.tagName === 'INPUT' && clickedElement.type === 'checkbox' && clickedElement.name === 'filter') {
              console.log(clickedElement.value);
                  if (clickedElement.checked) {
                      thisBooksList.filters.push(clickedElement.value);
                   } else {
                   const filterId = thisBooksList.filters.indexOf(clickedElement.value);
                  thisBooksList.filters.splice(filterId, 1);
                  }
               } 
  
              thisBooksList.filterBooks();
          });

      }

    render(){
      const thisBooksList = this;

      for(let book of thisBooksList.data){
        const ratingBgc = thisBooksList.determineRatingBgc(book.rating);
        const ratingWidth = book.rating * 10;
        const bookAllData = {
            ...book,
            ratingBgc: ratingBgc,
            ratingWidth: ratingWidth
        };
        const generatedHTML = templates.bookList(bookAllData);
        const element = utils.createDOMFromHTML(generatedHTML);
        const booksListContainer = document.querySelector(select.containerOf.list);
        booksListContainer.appendChild(element);

      }
    }

    

    filterBooks(){
        const thisBooksList = this;

        for (let book of thisBooksList.data){
            let shouldBeHidden = false;
            for (let filter of thisBooksList.filters){
                if (!book.details[filter]){
                    shouldBeHidden = true;
                    break;
                }
            }
            const bookImage = document.querySelector('.book__image[data-id="' + book.id + '"]');
            if (shouldBeHidden){
                bookImage.classList.add('hidden');
            } else {
                bookImage.classList.remove('hidden');
            }
        }
    };

    determineRatingBgc(rating) {
        let ratingBackground = '';
    
        if (rating < 6) {
            ratingBackground = 'linear-gradient(to bottom, #fefcea 0%, #f1da36 100%)';
        } else if (rating > 6 && rating <= 8) {
            ratingBackground = 'linear-gradient(to bottom, #b4df5b 0%, #b4df5b 100%)';
        } else if (rating > 8 && rating <= 9) {
            ratingBackground = 'linear-gradient(to bottom, #299a0b 0%, #299a0b 100%)';
        } else if (rating > 9) {
            ratingBackground = 'linear-gradient(to bottom, #ff0084 0%, #ff0084 100%)';
        }
    
        return ratingBackground;
    }

  }

  const app = new BooksList();
}