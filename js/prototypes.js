String.prototype.replaceAll = function (search, replacement) {
  var target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};


Array.prototype.shuffle = function () {
  var input = this;
  for (var i = input.length - 1; i >= 0; i--) {
    var randomIndex = Math.floor(Math.random() * (i + 1));
    var itemAtIndex = input[randomIndex];
    input[randomIndex] = input[i];
    input[i] = itemAtIndex;
  }
  return input;
}

Array.prototype.appendToDom = function (dom) {
  this.forEach(function(item){
    var el = document.createElement(item.type)
    if (item.class) el.className = item.class
    if (item.attrs) {
      Object.keys(item.attrs).forEach(function (key) {
        el.setAttribute(key, item.attrs[key])
      });
    }
    if (item.text) el.innerText = item.text
    dom.appendChild(el)
  })
  return this
}
