let params = (new URL(document.location)).searchParams;
let lang =  params.get('lang')?.toUpperCase() ?? 'EN';
let idMuseums = params.get('museums')
let searchUrl = params.get('search')

const langDataSwitcher = (dataEN, dataJP) => {
  if(lang === 'EN'){
    document.querySelector('[data-lang="jp"]').classList.remove('active')
    document.querySelector('[data-lang="en"]').classList.add('active')
    return dataEN
  } else if(lang === 'JP'){
    document.querySelector('[data-lang="en"]').classList.remove('active')
    document.querySelector('[data-lang="jp"]').classList.add('active')
    return dataJP
  }
}

const titlePageEl = document.querySelector('[data-element="titlePage"]')
const titleDescriptionEl = document.querySelector('[data-element="descriptionPage"]')
titlePageEl.innerHTML = langDataSwitcher('Make everything museum.', '世界のすべてを<br>　ミュージアムに。')
titleDescriptionEl.innerHTML = langDataSwitcher('Welcome to an immersion in knowledge. Here you will find thousands of museums. You are free to participate. Current Number of Museums:', '知への没入へようこそ。ここには、幾千ものミュージアムがあります。あなたは自由に参加できます。現在の館数:')

const featuredMuseums = document.getElementById('listFeaturedMuseum')
const attachFeaturedMuseum = ({id, thumbnail, category, title, title_ja, like, liked, view, verified, link}) => {
  featuredMuseums.innerHTML += `
    <div class="swiper-slide featured-item" data-index="${id}">
      <img src="${thumbnail}" loading="lazy" class="img lazyload" alt=""/>
      
      <div class="information">
        <div class="titleContainer">
          <p class="bodyMediumMedium title">${langDataSwitcher(title, title_ja)}</p>
          <div class="verifiedContainer ${verified && 'show'}">
            <img class="verifiedIcon" src="assets/icon/check-verified-icon.png" alt=""/>
          </div>
        </div>

        <div class="statistic">
          <div class="item likeBtn ${liked ? "liked" : ""}">
            <!-- Love Icon -->
            <img src="assets/icon/heart.png" class="icon like" alt=""/>
            <img src="assets/icon/heart-gray.png" class="icon unlike" alt=""/>
            <p class="label">${like}</p>
          </div>
          <div class="item">
            <!-- Eye Icon -->
            <img src="assets/icon/eye.png" class="icon" alt=""/>
            <p class="label">${view}</p>
          </div>
        </div>
      </div>
    </div>
  `;
}

const listMuseums = document.getElementById('listMuseums')
const attachMuseum = ({id, thumbnail, category, title, title_ja, like, liked, view, verified, link}) => {
  const divEl = document.createElement('div');
  divEl.setAttribute('class', 'museum-item');
  divEl.setAttribute('data-index', id);
  divEl.setAttribute('data-filter', category);

  divEl.innerHTML = `
    <div class="" data-index="${id}" data-filter="${category}">
      <img src="${thumbnail}" loading="lazy" class="img lazyload" alt=""/>

      <div class="information">
        <div class="titleContainer">
          <p class="bodyMediumMedium title">${langDataSwitcher(title, title_ja)}</p>
          <div class="verifiedContainer ${verified && 'show'}">
            <img class="verifiedIcon" src="assets/icon/check-verified-icon.png" alt=""/>
          </div>
        </div>

        <div class="statistic">
          <div class="item likeBtn ${liked ? "liked" : ""}">
            <!-- Love Icon -->
            <img src="assets/icon/heart.png" class="icon like" alt=""/>
            <img src="assets/icon/heart-gray.png" class="icon unlike" alt=""/>
            <p class="label">${like}</p>
          </div>
          <div class="item">
            <!-- Eye Icon -->
            <img src="assets/icon/eye.png" class="icon" alt=""/>
            <p class="label">${view}</p>
          </div>
        </div>
      </div>
    </div>
  `;
  listMuseums.appendChild(divEl)
}

// Create a MediaQueryList object
const isMobile = window.matchMedia("(max-width: 576px)")
const museumNumbersEl = document.querySelector('[data-element="museums-number"]')
const numberOfDataLoadMore = 12

fetch('data.json', { cache : 'force-cache' }) // ADD modalPreviewVirtualion()
  .then(response => response.json())
  .then(results => {
    let dataLength;
    const _idMuseums = idMuseums ? idMuseums?.split('|') : undefined
    if (isMobile.matches) { // If media query matches mobile
      results.filter(item => _idMuseums ? _idMuseums.includes(item.id) : true).filter(item => item.mob).slice(0,12).map((data, index) => attachMuseum(data)) // All Museum Mobile
      dataLength = results.filter(item => _idMuseums ? _idMuseums.includes(item.id) : true).filter(item => item.mob).length
      museumNumbersEl.textContent = dataLength.toLocaleString()
    } else {
      results.filter(item => _idMuseums ? _idMuseums.includes(item.id) : true).slice(0,12).map((data, index) => attachMuseum(data)) // All Museum Desktop
      dataLength = results.filter(item => _idMuseums ? _idMuseums.includes(item.id) : true).length
      museumNumbersEl.textContent = dataLength.toLocaleString()
    }

    if(dataLength <= numberOfDataLoadMore){
      document.querySelector('.loadMoreMuseumBtn').style.display = 'none'
    }else {
      document.querySelector('.loadMoreMuseumBtn').style.display = 'block'
    }
    results.filter(item => item.featured).map((data, index) => attachFeaturedMuseum(data)) // Featured Museum

    if(_idMuseums){
      listMuseums.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Running Search with Url Search Params
    if(searchUrl){
      searchMuseum()
      document.getElementById('search-museum').value = searchUrl
      // console.log('run search', searchUrl)
    }

    modalPreviewVirtualion()
  })
  .catch(error => console.log(error));


// Search Data Museum By Title
let cards = document.querySelectorAll('.box')

window.onload = searchMuseum
function searchMuseum() {
    let search_query = document.getElementById("search-museum").value || searchUrl;
    listMuseums.innerHTML = ''

    const url = new URL(window.location);
    url.searchParams.set('search', search_query);
    window.history.pushState(null, '', url.toString());

    return fetch('data.json', { cache : 'force-cache' })
      .then(response => response.json())
      .then(data => {
        const dataLength = data.filter(value => value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase())).length
        if(dataLength === 0){
          document.querySelector('.containerDataNotFound').style.display = 'block'
          document.querySelector('.loadMoreMuseumBtn').style.display = 'none'
        } else {
          document.querySelector('.containerDataNotFound').style.display = 'none'
          document.querySelector('.loadMoreMuseumBtn').style.display = 'block'
        }

        if(dataLength > 12){
          document.querySelector('.loadMoreMuseumBtn').style.display = 'block'
        }else {
          document.querySelector('.loadMoreMuseumBtn').style.display = 'none'
        }

        if (isMobile.matches) { // If media query matches mobile
          data
            .filter(item => item.mob)
            .filter(value => value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()))
            .slice(0,12)
            .map((data, index) => attachMuseum(data))
        } else {
          data
            .filter(value => value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()))
            .slice(0,12)
            .map((data, index) => attachMuseum(data))  
        }
        modalPreviewVirtualion()
        listMuseums.scrollIntoView({ behavior: "smooth", block: "start" });
      })
      .catch(error => console.log(error));
}

//A little delay
let typingTimer;               
let typeInterval = 100;  
let searchInput = document.getElementById('search-museum');

searchInput.addEventListener('change', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(searchMuseum, typeInterval);
});

// Search Data Musuem By Trending Search
const trendings = document.querySelectorAll('.trending-item');
trendings.forEach(trending => { 
  trending.addEventListener('click', function(e) {
    let selectedFilter = trending.getAttribute('data-search');
    let itemsToHide = document.querySelectorAll(`.list-museums .museum-item:not([data-filter='${selectedFilter}'])`);
    let itemsToShow = document.querySelectorAll(`.list-museums [data-filter='${selectedFilter}']`);

    let searchInput = document.getElementById("search-museum")    

    if (e.currentTarget.classList.contains('selected')) {
      e.currentTarget.classList.remove('selected');

      itemsToHide = [];
      itemsToShow = document.querySelectorAll('.list-museums [data-filter]');
      searchInput.value = ''
    } else {
      trendings.forEach(el => {
        el.classList.remove('selected')
      })

      e.currentTarget.classList.add('selected')
      searchInput.value = selectedFilter

      // listMuseums.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    searchMuseum()

    if (selectedFilter == 'all') {
      itemsToHide = [];
      itemsToShow = document.querySelectorAll('.list-museums [data-filter]');
    }

    itemsToHide.forEach(el => {
      el.classList.add('hide');
      el.classList.remove('show');
    });

    itemsToShow.forEach(el => {
      el.classList.remove('hide');
      el.classList.add('show'); 
    });
  });
});


// Filter Data Museum
window.onload = filterDataMuseum
function filterDataMuseum() {
  const filters = document.querySelectorAll('.filter-item');

  filters.forEach(filter => { 
    filter.addEventListener('click', function(e) {
      let selectedFilter = filter.getAttribute('data-filter');
      let itemsToHide = document.querySelectorAll(`.list-museums .museum-item:not([data-filter="${selectedFilter}"])`);
      let itemsToShow = document.querySelectorAll(`.list-museums [data-filter="${selectedFilter}"]`);

      listMuseums.innerHTML = ''

      if (e.currentTarget.classList.contains('selected')) {
        e.currentTarget.classList.remove('selected');

        itemsToHide = [];
        itemsToShow = document.querySelectorAll('.list-museums [data-filter]');
        fetch('data.json', { cache : 'force-cache' })
          .then(response => response.json())
          .then(data => {
            if (isMobile.matches) { // If media query matches mobile
              data
                .filter(item => item.mob)
                .slice(0,12)
                .map((data, index) => attachMuseum(data))
            } else {
              data
                .slice(0,12)
                .map((data, index) => attachMuseum(data))
            }
            modalPreviewVirtualion()
          })
          .catch(error => console.log(error));
      } else {
        filters.forEach(el => {
          el.classList.remove('selected')
        })

        e.currentTarget.classList.add('selected')
        fetch('data.json', { cache : 'force-cache' })
          .then(response => response.json())
          .then(data => {
            if (isMobile.matches) { // If media query matches mobile
              data
                .filter(item => item.mob)
                .filter(item => item.category === selectedFilter)
                .slice(0,12)
                .map((data, index) => attachMuseum(data))
            } else {
              data
                .filter(item => item.category === selectedFilter)
                .slice(0,12)
                .map((data, index) => attachMuseum(data))
            }
              modalPreviewVirtualion()
          })
          .catch(error => console.log(error));
      }

      if (selectedFilter == 'all') {
        itemsToHide = [];
        itemsToShow = document.querySelectorAll('.list-museums [data-filter]');
      }

      itemsToHide.forEach(el => {
        el.classList.add('hide');
        el.classList.remove('show');
      });

      itemsToShow.forEach(el => {
        el.classList.remove('hide');
        el.classList.add('show'); 
      });
    });
  });
}



// Variables
const dropdownTime = document.querySelector('#dropdownTime');
const dropdownCategory = document.querySelector('#dropdownCategory');

const body = document.body;

// Functions
const toggleDropdown = (event, element) => {
  event.stopPropagation();
  element.classList.toggle('opened');
};

// const selectOption = (event) => {
//   input.value = event.currentTarget.textContent;
// };

const closeDropdownFromOutside = () => {
  if (dropdownTime.classList.contains('opened')) {
    dropdownTime.classList.remove('opened');
  }

  if (dropdownCategory.classList.contains('opened')) {
    dropdownCategory.classList.remove('opened');
  }
};
// Event Listeners

body.addEventListener('click', closeDropdownFromOutside);

const selectOption = (dropdownId) => {
  const dropdownEl = document.querySelector(dropdownId);
  const label = dropdownEl.querySelector('.labelSelected');
  const listOfOptions = dropdownEl.querySelectorAll('.option');

  listOfOptions.forEach((option) => {
    option.addEventListener('click', () => {
      listMuseums.innerHTML = ''
      
      listOfOptions.forEach(el => {
        el.classList.remove('active')
      })
  
      option.classList.add('active')
      label.textContent = event.currentTarget.firstElementChild.textContent;
      dropdownEl.setAttribute('data-option-selected', event.currentTarget.getAttribute('data-option'))

      if(event.currentTarget.getAttribute('data-option') === 'latest'){
          return fetch('data.json', { cache : 'force-cache' })
            .then(response => response.json())
            .then(data => {
                data
                  .filter(value => value.title.toLocaleLowerCase().includes(searchUrl.toLocaleLowerCase()))
                  .sort(function(a,b){
                    return new Date(b.date) - new Date(a.date);
                  })
                  .slice(0,12)
                  .map((data, index) => attachMuseum(data))  
            })
            .catch(error => console.log(error));
      }else if(event.currentTarget.getAttribute('data-option') === 'old') {
        return fetch('data.json', { cache : 'force-cache' })
            .then(response => response.json())
            .then(data => {
                data
                  .filter(value => value.title.toLocaleLowerCase().includes(searchUrl.toLocaleLowerCase()))
                  .sort(function(a,b){
                    return new Date(a.date) - new Date(b.date);
                  })
                  .slice(0,12)
                  .map((data, index) => attachMuseum(data))  
            })
            .catch(error => console.log(error));
      }

      let itemsToHide = document.querySelectorAll(`.list-museums [data-filter]`);
      let itemsToShow = document.querySelectorAll(`.list-museums [data-filter]`);

      itemsToHide.forEach(el => {
        el.classList.add('hide');
        el.classList.remove('show');
      });

      setTimeout(() => {
        itemsToShow.forEach(el => {
          el.classList.remove('hide');
          el.classList.add('show'); 
        });
      }, 150);
    });
  });
}

selectOption('#dropdownTime')
selectOption('#dropdownCategory')

dropdownTime.addEventListener('click', (e) => {
  toggleDropdown(e, dropdownTime)
  if (dropdownCategory.classList.contains('opened')) {
    dropdownCategory.classList.remove('opened');
  }
});
dropdownCategory.addEventListener('click', (e) => {
  toggleDropdown(e, dropdownCategory)
  if (dropdownTime.classList.contains('opened')) {
    dropdownTime.classList.remove('opened');
  }
});


// Navigation Drawer
const hamburgerBtn = document.querySelector('.hamburgerBtn');
const navigationDrawer = document.querySelector('.navigationDrawer');
const closeNavigationBtn = document.querySelector('.closeNavigationBtn');

hamburgerBtn.addEventListener('click', (e) => {
  navigationDrawer.classList.add('show')
  e.currentTarget.classList.add('hide')
  closeNavigationBtn.classList.remove('hide')
})

closeNavigationBtn.addEventListener('click', (e) => {
  navigationDrawer.classList.remove('show')
  e.currentTarget.classList.add('hide')
  hamburgerBtn.classList.remove('hide')
})


// ShowAll FilterCategory
const showAllCategory = document.querySelector('.showAllBtn');
const filterCategoryContainer = document.querySelector('.filters-category');

showAllCategory.addEventListener('click', (e) => {
  filterCategoryContainer.classList.add('showAll');
  e.currentTarget.remove();
})

// Fetch Category From Data .txt
fetch("assets/variables/categories.txt")
  .then((res) => res.text())
  .then((textCategory) => {
    // do something with "text"
    const filterCategory = document.querySelector('.filters-category [data-filter="template"]')
    textCategory.split("\r\n").forEach((category) => {
      const filterCategoryClone = filterCategory.cloneNode(true)
      filterCategoryClone.textContent = category
      filterCategoryClone.setAttribute('data-filter', category.toLowerCase())
      filterCategoryContainer.appendChild(filterCategoryClone)
    })
    filterCategory.remove()
    filterDataMuseum()
   })
  .catch((e) => console.error(e));


// Swiper Museum Featured
const swiperFeaturedMuseum = new Swiper('.swiper-featured', {
  // Optional parameters
  // direction: 'vertical',
  slidesPerView: 1,
  // spaceBetween: 24,
  loop: true,

  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  // Navigation arrows
  navigation: {
    nextEl: '.nextBtn',
    prevEl: '.prevBtn',
  },
  breakpoints: {
    // when window width is >= 320px
    // 320: {
    //   slidesPerView: 1,
    //   spaceBetween: 20
    // },
    // when window width is >= 768px
    768: {
      slidesPerView: 2,
      spaceBetween: 24
    },
    // when window width is >= 1024px
    1024: {
      slidesPerView: 3,
      spaceBetween: 24
    }
  }

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
});


window.onload = function() {
  // Like Button
  const likeMuseumBtn = document.querySelectorAll('.likeBtn')

  likeMuseumBtn.forEach((likeMusuem) => {
    likeMusuem.addEventListener('click', el => {
      if (el.currentTarget.classList.contains('liked')) {
        el.currentTarget.classList.remove('liked')
      } else {
        el.currentTarget.classList.add('liked')
      }
    })
  })
}

const listMuseumClass = document.querySelector('.list-museums')
const increaseThumnailBtn = document.querySelector('.increaseThumnailBtn')
const decreaseThumnailBtn = document.querySelector('.decreaseThumnailBtn')


increaseThumnailBtn.addEventListener('click', () => {
  const thumbnailSize = parseInt(listMuseumClass.getAttribute('data-thumbnail-size'))  
  if(thumbnailSize<6){
    listMuseumClass.classList.remove(`thumbnail-${thumbnailSize}`)
    listMuseumClass.classList.add(`thumbnail-${thumbnailSize+1}`)
    listMuseumClass.setAttribute('data-thumbnail-size', thumbnailSize+1)
  }
})

decreaseThumnailBtn.addEventListener('click', () => {
  const thumbnailSize = parseInt(listMuseumClass.getAttribute('data-thumbnail-size'))
  if(thumbnailSize>1){
    listMuseumClass.classList.remove(`thumbnail-${thumbnailSize}`)
    listMuseumClass.classList.add(`thumbnail-${thumbnailSize-1}`)
    listMuseumClass.setAttribute('data-thumbnail-size', thumbnailSize-1)
  }
})

function scrollToBottom(){
    var height = document.body.scrollHeight;
    window.scrollTo({behavior:'smooth', top: height});
}

// Modal Preview Virtualion
window.onload = modalPreviewVirtualion
function modalPreviewVirtualion() {
  const url = new URL(window.location);
  
  const musuemItems = document.querySelectorAll('.museum-item');
  const featuredItems = document.querySelectorAll('.featured-item');
  const modalOverlay = document.querySelector('.modalOverlay');
  const modalPreviewVirtualion = document.querySelector('.modalPreviewVirtualion');
  const closeBtnModalPreviewVirtualion = document.querySelector('.modalCloseButton');
  const body = document.querySelector('body')

  const contentImage = document.querySelector('.modalInnerContainer .imgContainer .img')
  const contentTitle = document.querySelector('.modalInnerContainer .contentTitle')
  const contentDescription = document.querySelector('.modalInnerContainer .contentDescription')
  const creatorValue = document.querySelector('.modalInnerContainer .contentCreatorContainer .creatorValue')
  const contentLike = document.querySelector('.modalInnerContainer .statistic .label.like')
  const contentView = document.querySelector('.modalInnerContainer .statistic .label.view')
  const isVerified = document.querySelector('.modalInnerContainer .contentVerified')
  const labelAvailibilityEl = document.querySelector('.modalInnerContainer .labelAvailibility')
  const verifiedBy = document.querySelector('.modalInnerContainer .contentVerified .verifiedBy')
  const getStartedButton = document.querySelector('.modalInnerContainer .getStartedButton')

  if(url.searchParams.get('id')){
    console.log(url.searchParams.get('id'))

    fetch('data.json', { cache : 'force-cache' })
      .then(response => response.json())
      .then(data => {
        const selectedData = data.filter(item => item.id === url.searchParams.get('id'))[0]
        contentImage.setAttribute('src', selectedData.thumbnail)
        contentTitle.textContent = langDataSwitcher(selectedData.title, selectedData.title_ja)
        contentDescription.textContent = langDataSwitcher(selectedData.description, selectedData.description_ja)
        creatorValue.textContent = selectedData.creator
        contentLike.textContent = selectedData.like
        contentView.textContent = selectedData.view
        verifiedBy.textContent = selectedData.verifiedBy
        selectedData.verified ? isVerified.style.display = 'flex' : isVerified.style.display = 'none'
        selectedData.mob ? labelAvailibilityEl.style.display = 'none' : labelAvailibilityEl.style.display = 'flex'
        getStartedButton.setAttribute('href', selectedData.link)
      })
      .catch(error => console.log(error));

    modalPreviewVirtualion.classList.add('show');
    modalPreviewVirtualion.classList.remove("hide");
    body.style.overflowY = 'hidden';
  }

  musuemItems.forEach(el => {
    el.addEventListener("click", (e) => {
      const dataIndex = el.getAttribute('data-index')

      url.searchParams.set('id', dataIndex);
      window.history.pushState(null, '', url.toString());

      fetch('data.json', { cache : 'force-cache' })
        .then(response => response.json())
        .then(data => {
          const selectedData = data.filter(item => item.id === dataIndex)[0]
          contentImage.setAttribute('src', selectedData.thumbnail)
          contentTitle.textContent = langDataSwitcher(selectedData.title, selectedData.title_ja)
          contentDescription.textContent = langDataSwitcher(selectedData.description, selectedData.description_ja)
          creatorValue.textContent = selectedData.creator
          contentLike.textContent = selectedData.like
          contentView.textContent = selectedData.view
          verifiedBy.textContent = selectedData.verifiedBy
          selectedData.verified ? isVerified.style.display = 'flex' : isVerified.style.display = 'none'
          selectedData.mob ? labelAvailibilityEl.style.display = 'none' : labelAvailibilityEl.style.display = 'flex'
          getStartedButton.setAttribute('href', selectedData.link)
        })
        .catch(error => console.log(error));

      modalPreviewVirtualion.classList.add('show');
      modalPreviewVirtualion.classList.remove("hide");
      body.style.overflowY = 'hidden';
    })
  })

  featuredItems.forEach(el => {
    el.addEventListener("click", (e) => {
      const dataIndex = el.getAttribute('data-index')

      url.searchParams.set('id', dataIndex);
      window.history.pushState(null, '', url.toString());

      fetch('data.json', { cache : 'force-cache' })
        .then(response => response.json())
        .then(data => {
          const selectedData = data.filter(item => item.id === dataIndex)[0]
          contentImage.setAttribute('src', selectedData.thumbnail)
          contentTitle.textContent = langDataSwitcher(selectedData.title, selectedData.title_ja)
          contentDescription.textContent = langDataSwitcher(selectedData.description, selectedData.description_ja)
          creatorValue.textContent = selectedData.creator
          contentLike.textContent = selectedData.like
          contentView.textContent = selectedData.view
          verifiedBy.textContent = selectedData.verifiedBy
          selectedData.verified ? isVerified.style.display = 'flex' : isVerified.style.display = 'none'
          selectedData.mob ? labelAvailibilityEl.style.display = 'none' : labelAvailibilityEl.style.display = 'flex'
          getStartedButton.setAttribute('href', selectedData.link)
        })
        .catch(error => console.log(error));

      modalPreviewVirtualion.classList.add('show');
      modalPreviewVirtualion.classList.remove("hide");
      body.style.overflowY = 'hidden';
    })
  })

  modalOverlay.addEventListener('click', () => {
    modalPreviewVirtualion.classList.add("hide");
    modalPreviewVirtualion.classList.remove("show");
    body.style.overflowY = 'scroll';

    url.searchParams.delete('id');
    window.history.pushState(null, '', url.toString());
  });

  closeBtnModalPreviewVirtualion.addEventListener("click", () => {
    modalPreviewVirtualion.classList.add("hide");
    modalPreviewVirtualion.classList.remove("show");
    body.style.overflowY = 'scroll';

    url.searchParams.delete('id');
    window.history.pushState(null, '', url.toString());
  });
}

// Loadmore Button
const loadMoreMuseumBtn = document.querySelector('.loadMoreMuseumBtn')
loadMoreMuseumBtn.addEventListener('click', () => {
  const museumsItem = document.querySelectorAll('.list-museums .museum-item')
  // const thumbnailSize = parseInt(listMuseumClass.getAttribute('data-thumbnail-size'))  
  const numberOfDataLoadMore = 12
  return fetch('data.json', { cache : 'force-cache' })
      .then(response => response.json())
      .then(data => {
        let search_query = document.getElementById("search-museum").value;
        const categorySelected = document.querySelector('.filter-item.selected')?.getAttribute('data-filter')
        let dataLength;
        if (isMobile.matches) { // If media query matches mobile
          dataLength = data.filter(item => item.mob)
                          .filter(value => search_query ? value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()) : value)
                          .filter(_data => categorySelected ? _data.category === categorySelected : _data)
                          .slice(museumsItem.length).length
        } else  {
          dataLength = data.filter(value => search_query ? value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()) : value)
                          .filter(_data => categorySelected ? _data.category === categorySelected : _data)
                          .slice(museumsItem.length).length
        }

        if(dataLength <= numberOfDataLoadMore){
          document.querySelector('.loadMoreMuseumBtn').style.display = 'none'
        }else {
          document.querySelector('.loadMoreMuseumBtn').style.display = 'block'
        }
         
        if (isMobile.matches) { // If media query matches mobile
          data
            .filter(item => item.mob)
            .filter(value => search_query ? value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()) : value)
            .filter(_data => categorySelected ? _data.category === categorySelected : _data)
            .slice(museumsItem.length, museumsItem.length + numberOfDataLoadMore)
            .map((data, index) => attachMuseum(data))
        } else {
          data
            .filter(value => search_query ? value.title.toLocaleLowerCase().includes(search_query.toLocaleLowerCase()) : value)
            .filter(_data => categorySelected ? _data.category === categorySelected : _data)
            .slice(museumsItem.length, museumsItem.length + numberOfDataLoadMore)
            .map((data, index) => attachMuseum(data))
        }
        scrollToBottom()
        modalPreviewVirtualion()
      })
      .catch(error => console.log(error));
})




// Open Drawer Share
const shareBtn = document.querySelector('.shareBtn')
const shareContainer = document.querySelector('.shareContainer')
const shareDrawer = document.querySelector('.shareDrawer')
shareBtn.addEventListener('click', (e) => {
  e.stopPropagation()
  shareContainer.classList.toggle('opened');
})

shareDrawer.addEventListener('click', (e) => {
  e.stopPropagation();
})

// Event Listeners
body.addEventListener('click', () => {
  if (shareContainer.classList.contains('opened')) {
    shareContainer.classList.remove('opened');
  }
});

// Open Drawer Tutorial
const tutorialBtn = document.querySelector('.tutorialBtn')
const tutorialContainer = document.querySelector('.tutorialContainer')
const tutorialDrawer = document.querySelector('.tutorialDrawer')
tutorialBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  tutorialContainer.classList.toggle('opened');
})

tutorialDrawer.addEventListener('click', (e) => {
  e.stopPropagation();
})

// Event Listeners
body.addEventListener('click', () => {
  if (tutorialContainer.classList.contains('opened')) {
    tutorialContainer.classList.remove('opened');
  }
});

// Swiper Tutorial Virtualion
const swiperTutorialVirtualion = new Swiper('.swiper-tutorial-virtualion', {
  // Optional parameters
  // direction: 'vertical',
  slidesPerView: 1,
  spaceBetween: 40,
  // loop: true,

  // If we need pagination
  // pagination: {
  //   el: '.swiper-pagination',
  // },

  // Navigation arrows
  navigation: {
    nextEl: '.nextBtnTutorial',
    prevEl: '.prevBtnTutorial',
  },
  breakpoints: {
    // when window width is >= 320px
    // 320: {
    //   slidesPerView: 1,
    //   spaceBetween: 20
    // },
    // when window width is >= 768px
    // 768: {
    //   slidesPerView: 2,
    //   spaceBetween: 24
    // },
    // when window width is >= 1024px
    // 1024: {
    //   slidesPerView: 3,
    //   spaceBetween: 24
    // }
  }

  // And if we need scrollbar
  // scrollbar: {
  //   el: '.swiper-scrollbar',
  // },
});

// const swiper = new Swiper('.swiper-testimonial', {
//   navigation: {
//     nextEl: ".swiper-testimonial-button-next",
//     prevEl: ".swiper-testimonial-button-prev",
//   },
//   centeredSlides: true,
//   slidesPerView: 1,
//   loop: true,
//   autoplay: true
// });

swiperTutorialVirtualion.on('realIndexChange', function (e){
  document.querySelectorAll('.tutorialPagination .paginationItem').forEach(el => {
    el.classList.remove('active');
  })
  document.querySelectorAll('.tutorialPagination .paginationItem')[e.realIndex].classList.add('active')

  if(e.realIndex === 0){
    document.querySelector('.tutorialNavigation .prevBtnTutorial').classList.add('disabled')
  } else {
    document.querySelector('.tutorialNavigation .prevBtnTutorial').classList.remove('disabled')
  }

  if(e.realIndex === 3){
    document.querySelector('.tutorialNavigation .nextBtnTutorial').classList.add('disabled')
  } else {
    document.querySelector('.tutorialNavigation .nextBtnTutorial').classList.remove('disabled')
  }
})


