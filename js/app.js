$(function() {
    loadMarsPhotosFromServer();
    loadBackgroundPhoto();
    loadMorePhotos();
    changePhotos();
});

let currentDate = new Date;
let currentYear = currentDate.getFullYear();
let currentMonth = currentDate.getMonth();
console.log(currentDate, currentMonth, currentYear);

let nasaMarsUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
let dataUrl ="?earth_date=2018-5-3";
//var cameraUrl ="?camera=fhaz"
let apiKey = "&api_key=NQnFwQPnWWDlIP2UhpHiIBL9oF0ErBBEz2VrvMjZ";
let fullUrl = nasaMarsUrl + dataUrl + apiKey;

//ładowanie i dodanie 5-ciu zdjęć do galerii po załadowaniu strony
function loadMarsPhotosFromServer() {

    $.ajax({
        url: fullUrl
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
            url: fullUrl
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

//ładowanie zdjęcia dla tła po załadowaniu strony i ustawianie go jako tło

function loadBackgroundPhoto(){
    $.ajax({
        url: "https://epic.gsfc.nasa.gov/api/enhanced/date/2018-04-01?api_key=NQnFwQPnWWDlIP2UhpHiIBL9oF0ErBBEz2VrvMjZ"
    }).done(function(resp) {
        //wyświetlam losowo jedno z 13 zdjęć z 01.04
        setBackground(resp[Math.floor(Math.random() * 13)].image);
    }).fail(function(err) {
        console.log(err);
    })
}

function setBackground(photo) {
    let headerPhoto = $('.welcome__photo');
    //ścieżka dla zdjęć z 1.04.2018
    let path = "https://epic.gsfc.nasa.gov/archive/enhanced/2018/04/01/jpg/";
    let image = path + photo + ".jpg";

    console.log(image);
    //mainSection.css("background-color", "blue");
    headerPhoto.css("background-image", "url(\"" + image + "\")");
}