exports.getDay = function(){
    let day = new Date();
    let options = { weekday: "long", day: "numeric", month: "long" };
    return today = (day.toLocaleDateString('en-US', options));
}