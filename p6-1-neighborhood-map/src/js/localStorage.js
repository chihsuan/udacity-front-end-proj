(function(window) {

  window.getLocalStorage = getLocalStorage;
  window.saveToLocalStorage = saveToLocalStorage;

  /*
  * @description Save to localStorage
  * @param {string} key
  * @param {object, string, array} value
  * */
  function saveToLocalStorage(key, value) {
    if(typeof(Storage) === "undefined") {
      return;
    }
    try {
      localStorage.setItem(key, JSON.stringify(value));
    }
    catch(e) {
      console.log(e);
    }
  }

  /*
  * @description Get data from localStorage
  * @param {function} cb
  * @param {object} opts, options for callback
  * */
  function getLocalStorage(key, cb, opts) {
    if(typeof(Storage) === "undefined") {
      return;
    }
    var result = localStorage.getItem(key);
    if (result) {
      try {
        result = JSON.parse(result);
        cb(result, opts);
      }
      catch(e) {
        console.log(e);
      }
    }
  }

})(window);
