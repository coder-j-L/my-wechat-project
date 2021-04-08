function transTime(unixtime) {
  var dateTime = new Date(parseInt(unixtime))
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var day = dateTime.getDate();
  var hour = dateTime.getHours();
  var minute = dateTime.getMinutes();
  var second = dateTime.getSeconds();
  var now = new Date();
  var now_new = Date.parse(now.toDateString());
  var milliseconds = now_new - dateTime;
  var timeSpanStr = year + '-' + month + '-' + day;
  return timeSpanStr;
}

module.exports = {
  transTime: transTime
}