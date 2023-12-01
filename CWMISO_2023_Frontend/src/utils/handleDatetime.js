import dayjs from 'dayjs'

Date.prototype.minusHours = function (h) {
  this.setHours(this.getHours() - h)
  return this
}
const useHandleDatetime = {
  isoStrToLocalStr(isoStr) {
    /** isoStr to localDate Thailand
            Example '2023-08-28T16:42:42.000Z' to '9 พฤศจิกายน 2566' **/
    let dateObj = new Date(isoStr).minusHours(7)
    return dateObj.toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      
    });
    // return new Date(isoStr).toLocaleDateString('th-TH')
    // return new Date(isoStr).minusHours(7)
  },
  localStrToIsoStr(localStr) {
    /** localStr Thailand to isoDate
            Example '28/8/2566 23:42:42' to '2023-08-28T16:42:42.000Z' **/
    let dateObj = new Date(localStr)
    return dateObj.toISOString()
  },
  isoStrToDayjs(isoStr) {
    /** isoStr to dayjs
            Example '2023-06-19 14:38:09' to 'Monday 19 June, 2023' **/
    let date = dayjs(isoStr)
    // Then specify how you want your dates to be formatted
    return date.format('dddd D MMMM, YYYY')
  }
}

export default useHandleDatetime
