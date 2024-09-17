const body = document.body;
// let params = (new URL(document.location)).searchParams;
// let lang =  params.get('lang')?.toUpperCase() ?? 'EN';

const langDataSwitcher = (dataEN, dataJP) => {
  const htmlLang = document.querySelector('html').getAttribute('lang')
  if(htmlLang === 'en'){
    document.querySelector('[data-lang="jp"]').classList.remove('active')
    document.querySelector('[data-lang="en"]').classList.add('active')
    return dataEN
  } else if(htmlLang === 'jp'){
    document.querySelector('[data-lang="en"]').classList.remove('active')
    document.querySelector('[data-lang="jp"]').classList.add('active')
    return dataJP
  }
}

document.querySelector('.language-switcher-item[data-lang="en"]').addEventListener('click', () => {
  document.querySelector('html').setAttribute('lang', 'en')
  loadInformationDetail()
})
document.querySelector('.language-switcher-item[data-lang="jp"]').addEventListener('click', () => {
  document.querySelector('html').setAttribute('lang', 'jp')
  loadInformationDetail()
})

// Open Drawer Share
const shareBtn = document.querySelector('.shareBtn')
const shareContainer = document.querySelector('.shareContainer')
const shareDrawer = document.querySelector('.shareDrawer')
shareBtn?.addEventListener('click', (e) => {
  e.stopPropagation()
  shareContainer.classList.toggle('opened');
})

shareDrawer?.addEventListener('click', (e) => {
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


// Toogle Detail Information

const toogleButtonInformationDetail = document.querySelector('.actionBtn.informationDetailButton')
const informationDetailContainer = document.querySelector('.informationDetailBlock .informationDetailContainer')
toogleButtonInformationDetail.addEventListener('click', (e) => {
  e.stopPropagation();
  if (informationDetailContainer.classList.contains('show')) {
    informationDetailContainer.classList.remove('show');
    toogleButtonInformationDetail.classList.remove('active')
  }else {
    informationDetailContainer.classList.add('show')
    toogleButtonInformationDetail.classList.add('active')
  }
})




informationDetailContainer.addEventListener('click', (e) => {
  e.stopPropagation();
})

/*
body.addEventListener('click', () => {
  if (informationDetailContainer.classList.contains('show')) {
    informationDetailContainer.classList.remove('show');
    toogleButtonInformationDetail.classList.remove('active')
  }
});
*/


// Append Data To Detail Information Virtualion
window.onload = loadInformationDetail
function loadInformationDetail () {
  const location = (new URL(document.location));
  const searchLocation = location.search

  const contentTitle = document.querySelector('.informationDetailContainer .informationTitle')
  const contentDescription = document.querySelector('.informationDetailContainer .informationDescription')
  const creatorValue = document.querySelector('.informationDetailContainer .informationContainerCreator .informationCreatorValue')
  const contentLike = document.querySelector('.informationDetailContainer .informationStatisticItem .informationStatisticValue.like')
  const contentView = document.querySelector('.informationDetailContainer .informationStatisticItem .informationStatisticValue.view')
  const isVerified = document.querySelector('.informationDetailContainer .informationDetailHeader .informationVerified')
  const verifiedBy = document.querySelector('.informationDetailContainer .informationDetailHeader .informationVerifiedBy')

  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      const selectedData = data.filter(item => item.link.includes(searchLocation))[0]
      contentTitle.textContent = langDataSwitcher(selectedData.title, selectedData.title_ja)
      contentDescription.textContent = langDataSwitcher(selectedData.description, selectedData.description_ja)
      creatorValue.textContent = selectedData.creator
      contentLike.textContent = selectedData.like
      contentView.textContent = selectedData.view
      verifiedBy.textContent = selectedData.verifiedBy
      selectedData.verified ? isVerified.style.display = 'flex' : isVerified.style.display = 'none'
    })
    .catch(error => console.log(error));
}
loadInformationDetail()

// Copy Link 
const copyLinkButton = document.querySelector('.share-item-link.copyLink')
const labelCopiedInformation = document.querySelector('.containerLabelCopiedLink')
copyLinkButton.addEventListener('click', () => {
  labelCopiedInformation.classList.add('show');
  setTimeout(() => {
    labelCopiedInformation.classList.remove('show');
  }, 2000);
  navigator.clipboard.writeText(window.location.href)
})