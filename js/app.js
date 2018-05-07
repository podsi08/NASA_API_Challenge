$(function() {
    loadMarsPhotosFromServer();
    loadBackgroundPhoto();
    loadMorePhotos();
    changePhotos();
});

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

//ładowanie i dodanie 5-ciu zdjęć do galerii po załadowaniu strony
function loadMarsPhotosFromServer() {

    $.ajax({
        url: fullMarsUrl
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
    let gallery = $('.gallery__base');

    gallery.append(photosArray.map(function(photo) {
        return $("<img>").attr("src", photo);
    }))

}

//ładowanie i dodawanie kolejnych 5-ciu zdjęć do galerii po kliknięciu w przycisk "load more"
function loadMorePhotos() {
    let moreBtn = $('.btn_more');

    moreBtn.one("click", function() {
        $.ajax({
            url: fullMarsUrl
        }).done(function(resp) {
            console.log(resp.photos);
            let photos = resp.photos.slice(6, 12).map(function(photo){
                return photo.img_src;
            });
            moreBtn.hide();
            addToGallery(photos);
        }).fail(function(err) {
            console.log(err);
        })
    })
}

//TODO: napisać funkcję, która będzie pobierać datę z formularza, przekazywać do URL i pobierać nowe zdjęcia
//pomijanie zera wiodącego: np. parseInt("03", 10);
function changePhotos() {
    let dateInput = $('#date');
    let submit = $('#submit');

    submit.on("click", function() {
        let newDate = dateInput.val();

    })
}


//dla zdjęć tła data musi być wcześniejsza niż z wczoraj (nie ma tak szybko dostępnych nowych zdjęć), będą to zdjęcia sprzed tygodnia
let lastWeekMsDate = todaysDate - 7 * 24 * 60 * 60 * 1000;
let lastWeekDate = new Date(lastWeekMsDate);

let lastWeekYear = lastWeekDate.getFullYear();
let lastWeekMonth = lastWeekDate.getMonth() + 1;
let lastWeekDay = lastWeekDate.getDate();


let lastWeekMonthZero = lastWeekMonth < 10 ? `0${lastWeekMonth}` : lastWeekMonth;
let lastWeekDayZero = lastWeekDay < 10 ? `0${lastWeekDay}` : lastWeekDay;
console.log(typeof yesterdaysMonthZero);

let nasaEpicUrl = "https://epic.gsfc.nasa.gov/api/enhanced/";
let dateEpicUrl = `date/${lastWeekYear}-${lastWeekMonthZero}-${lastWeekDayZero}?`;
let fullEpicUrl = nasaEpicUrl + dateEpicUrl + apiKey;
console.log(fullEpicUrl);
//ładowanie zdjęcia dla tła po załadowaniu strony i ustawianie go jako tło

function loadBackgroundPhoto(){
    $.ajax({
        url: fullEpicUrl
    }).done(function(resp) {
        console.log(resp);
        //wyświetlam losowo jedno z 13 zdjęć z 01.04
        setBackground(resp[Math.floor(Math.random() * 13)].image);
    }).fail(function(err) {
        console.log(err);
    })
}

function setBackground(photo) {
    let headerPhoto = $('.welcome__photo');
    //ścieżka dla zdjęć sprzed tygodnia
    let path = `https://epic.gsfc.nasa.gov/archive/enhanced/${lastWeekYear}/${lastWeekMonthZero}/${lastWeekDayZero}/jpg/`;
    let image = path + photo + ".jpg";

    console.log(image);
    //mainSection.css("background-color", "blue");
    headerPhoto.css("background-image", "url(\"" + image + "\")");
}