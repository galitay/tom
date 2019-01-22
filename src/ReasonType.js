import home from "./assets/img/home.png";
import vacation from "./assets/img/vacation.png";
import sick from "./assets/img/sick.png";
import baby from "./assets/img/baby.png";
import early from "./assets/img/early.png";
import soldier from "./assets/img/soldier.png";

const ReasonType = {
    NONE: {id: 0, name: "N/A", image: "none"},
    WFH: {id: 6, name: "WFH", image: {home}},
    VACATION: {id: 1, name: "Vacation", image: {vacation}},
    SICK: {id: 2, name: "Sick", image: {sick}},
    SICK_CHILD: {id: 3, name: "Sick Child", image: {baby}},
    LEAVING_EARLY: {id: 5, name: "Leaving Early", image: {early}},
    RESERVE_DUTY: {id: 4, name: "Reserve Duty", image : {soldier}}
};

export default ReasonType;