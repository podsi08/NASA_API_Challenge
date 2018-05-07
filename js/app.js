$(function() {
    loadMarsPhotosFromServer(fullMarsUrl);
    loadBackgroundPhoto();
    loadMorePhotos(fullMarsUrl);
    changePhotos();
    animatedRocket();
});

let gallery = $('.gallery__base');
let moreBtn = $('.btn_more');


//odczytywanie wczorajszej daty
let todaysDate = new Date().getTime();
let yesterdaysMsDate = todaysDate - 24 * 60 * 60 * 1000;
let yesterdaysDate = new Date(yesterdaysMsDate);

let yesterdaysYear = yesterdaysDate.getFullYear();
let yesterdaysMonth = yesterdaysDate.getMonth() + 1;
let yesterdaysDay = yesterdaysDate.getDate();


let nasaMarsUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?";
//do url przekazuje wczorajszą datę
let dateMarsUrl =`earth_date=${yesterdaysYear}-${yesterdaysMonth}-${yesterdaysDay}&`;
//var cameraUrl ="?camera=fhaz"
let apiKey = "api_key=NQnFwQPnWWDlIP2UhpHiIBL9oF0ErBBEz2VrvMjZ";

let fullMarsUrl = nasaMarsUrl + dateMarsUrl + apiKey;


//ładowanie i dodanie 5-ciu zdjęć do galerii
function loadMarsPhotosFromServer(url) {
    $.ajax({
        url: url
    }).done(function(resp) {
        console.log(resp.photos);

        //tworzę tabicę z url wybranych zdjęć
        let photos = resp.photos.slice(0, 5).map(function(photo){
            return photo.img_src;
        });
        addToGallery(photos);
    }).fail(function(err) {
        console.log(err);
    })
}



//funkcja dodająca zdjęcia do galerii
function addToGallery(photosArray) {

    gallery.append(photosArray.map(function(photo) {
        return $("<img>").attr("src", photo);
    }))

}

//ładowanie i dodawanie kolejnych 5-ciu zdjęć do galerii po kliknięciu w przycisk "load more"
function loadMorePhotos(url) {
    moreBtn.one("click", function() {
        $.ajax({
            url: url
        }).done(function(resp) {
            console.log(resp.photos);
            let photos = resp.photos.slice(5, 11).map(function(photo){
                return photo.img_src;
            });
            moreBtn.hide();
            addToGallery(photos);
        }).fail(function(err) {
            console.log(err);
        })
    })
}

//funkcja zmieniająca zdjęcia w galerii po wybraniu nowej daty
function changePhotos() {
    let dateInput = $('#date');
    let submit = $('#submit');

    submit.on("click", function() {
        let newDate = new Date(dateInput.val());
        let newDateYear = newDate.getFullYear();
        let newDateMonth = newDate.getMonth() + 1;
        let newDateDay = newDate.getDate();

        let info = $('.info');

        //jeżeli została wybrana data dzisiejsza, z przyszłości lub żadna to zostanie wyświetlony komunikat, zdjęcia
        //w galerii pozostaną niezmienione
        if (newDate.getTime() > yesterdaysMsDate || dateInput.val() === '') {
            info.toggleClass('info__invisible')
        //po wybraniu poprawnej daty z przeszłości:
        } else {
            //pokaż guzik do ładowania kolejnych zdjęć
            moreBtn.show();

            //jeżeli wyświetlał się komunikat o złym wyborze daty, schowaj go
            !info.hasClass('info__invisible') && info.addClass('info__invisible');

            //usuwanie poprzednich zdjęć z galerii:
            $(gallery).children().remove();

            let newDateMarsUrl =`earth_date=${newDateYear}-${newDateMonth}-${newDateDay}&`;
            let newFullMarsUrl = nasaMarsUrl + newDateMarsUrl + apiKey;

            //załaduj 5 zdjęć z nowej daty
            loadMarsPhotosFromServer(newFullMarsUrl);

            //po kliknięciu w przycisk załaduj kolejne zdjęcia
            loadMorePhotos(newFullMarsUrl);
        }

    })
}


//ZDJĘCIE TŁA
//****************************************************************************************************************//

//dla zdjęć tła na sztywno ustalam datę, z której są dostępne zdjęcia (z niektórych dni nie ma)
let epicPhotoYear = '2018';
let epicPhotoMonth = '05';
let epicPhotoDay = '01';

let nasaEpicUrl = "https://epic.gsfc.nasa.gov/api/enhanced/";
let dateEpicUrl = `date/${epicPhotoYear}-${epicPhotoMonth}-${epicPhotoDay}?`;
let fullEpicUrl = nasaEpicUrl + dateEpicUrl + apiKey;

//ładowanie zdjęcia dla tła po załadowaniu strony i ustawianie go jako tło

function loadBackgroundPhoto(){
    $.ajax({
        url: fullEpicUrl
    }).done(function(resp) {
        console.log(resp);
        //wyświetlam losowo jedno ze zdjęć z podanej daty
        setBackground(resp[Math.floor(Math.random() * resp.length)].image);
    }).fail(function(err) {
        console.log(err);
    })
}

function setBackground(photo) {
    let headerPhoto = $('.welcome__photo');
    //ścieżka dla zdjęć z wybranej daty
    let path = `https://epic.gsfc.nasa.gov/archive/enhanced/${epicPhotoYear}/${epicPhotoMonth}/${epicPhotoDay}/jpg/`;
    let image = path + photo + ".jpg";
    headerPhoto.css("background-image", "url(\"" + image + "\")");
}


//animacje przy scrollowaniu

function animatedRocket() {
    $(window).scroll(throttle())
}


function throttle(wait = 500) {
    let image = $('.rocket_container').find('div');
    let time = Date.now();
    return function() {
        if ((time + wait - Date.now()) < 0) {
            image.removeClass('rocket').addClass('moving_rocket');
            console.log('scroll');
            time = Date.now();
            setTimeout(() => {
                image.removeClass('moving_rocket').addClass('rocket');
            }, 2000)
        }
    }
}