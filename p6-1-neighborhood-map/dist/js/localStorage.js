!function(o){function e(o,e){if("undefined"!=typeof Storage)try{localStorage.setItem(o,JSON.stringify(e))}catch(t){console.log(t)}}function t(o,e,t){if("undefined"!=typeof Storage){var a=localStorage.getItem(o);if(a)try{a=JSON.parse(a),e(a,t)}catch(n){console.log(n)}}}o.getLocalStorage=t,o.saveToLocalStorage=e}(window);