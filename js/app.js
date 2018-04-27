$(function() {
    loadMarsPhotosFromServer();
    loadBackgroundPhoto();
    loadMorePhotos();
});


var nasaMarsUrl = "https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos";
var dataUrl ="?earth_date=2018-4-1";
//var cameraUrl ="?camera=fhaz"
var apiKey = "&api_key=NQnFwQPnWWDlIP2UhpHiIBL9oF0ErBBEz2VrvMjZ";
var fullUrl = nasaMarsUrl + dataUrl + apiKey;

//ładowanie i dodanie 6-ciu zdjęć do galerii po załadowaniu strony
function loadMarsPhotosFromServer() {

    $.ajax({
        url: fullUrl
    }).done(function(resp) {
        console.log(resp.photos);

        //tworzę tabicę z url wybranych zdjęć
        var photos = resp.photos.slice(0, 6).map(function(photo){
            return photo.img_src;
        });

        addToGallery(photos);
    }).fail(function(err) {
        console.log(err);
    })
}

//funkcja dodająca zdjęcia do galerii
function addToGallery(photosArray) {
    var gallery = $('.gallery__base');

    gallery.append(photosArray.map(function(photo) {
        return $("<img>").attr("src", photo);
    }))

}

//ładowanie i dodawanie kolejnych 6-ciu zdjęć do galerii po kliknięciu w przycisk "load more"
function loadMorePhotos() {
    var moreBtn = $('.btn_more');

    moreBtn.one("click", function() {
        $.ajax({
            url: fullUrl
        }).done(function(resp) {
            console.log(resp.photos);
            var photos = resp.photos.slice(24, 30).map(function(photo){
                return photo.img_src;
            });
            moreBtn.hide();
            addToGallery(photos);
        }).fail(function(err) {
            console.log(err);
        })
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
    var mainSection = $('.welcome');
    //ścieżka dla zdjęć z 1.04.2018
    var path = "https://epic.gsfc.nasa.gov/archive/enhanced/2018/04/01/jpg/";
    var image = path + photo + ".jpg";

    console.log(image);
    //mainSection.css("background-color", "blue");
    mainSection.css("background-image", "url(\"" + image + "\")");
}