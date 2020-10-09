var BASE_URL = window.configs.baseUrl;
var IMAGES_PATH = window.configs.imagesPath;

const ReasonType = {
    NONE: {id: 0, name: "N/A", image: "none"},
    WFH: {id: 6, name: "WFH", image: BASE_URL + IMAGES_PATH + "home-white.png"},
    PTO: {id: 8, name: "PTO", image: BASE_URL + IMAGES_PATH + "pto-white.png"},
    AWAY: {id: 9, name: "Away", image: BASE_URL + IMAGES_PATH + "away-white.png"},
    VACATION: {id: 1, name: "Vacation", image: BASE_URL + IMAGES_PATH + "vacation-white.png"},
    SICK: {id: 2, name: "Sick", image: BASE_URL + IMAGES_PATH + "sick-white.png"},
    SICK_CHILD: {id: 3, name: "Sick Child", image: BASE_URL + IMAGES_PATH + "baby-white.png"},
    LEAVING_EARLY: {id: 5, name: "Leaving Early", image: BASE_URL + IMAGES_PATH + "sun-white.png"},
    ARRIVING_LATE: {id: 7, name: "Arriving Late", image : BASE_URL + IMAGES_PATH + "late-white.png"},
    RESERVE_DUTY: {id: 4, name: "Reserve Duty", image : BASE_URL + IMAGES_PATH + "soldier-white.png"}
};

export default ReasonType;