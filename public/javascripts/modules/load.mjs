const paydate1 = {}
const paydate2 = {}

let duration

onload=function() {
    try {
        paydate1.date = localStorage.getItem("paydate1");
        paydate1.frequency = localStorage.getItem("frequency1");
        
        paydate2.date = localStorage.getItem("paydate2");
        paydate2.frequency = localStorage.getItem("frequency2");

        duration = localStorage.getItem("duration");
    } catch (error) {
        console.error("Error loading data from localStorage:", error);
    }
}