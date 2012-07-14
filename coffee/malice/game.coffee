# main function
$ ->
  b = new Board
  $('#boardContainer').append b.view.el
  
  p = new Pairing
  $('#gameArea').append p.view.el

  c = new Card suit:'S', number:1
  b.view.$el.append(c.view.el)
  
  # showDebugColors()
  
# this debug function draws a background behind every visible element
# so that they can be laid out
showDebugColors = ->
  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange']
  for color in colors
    $(".test-#{color}").css
      backgroundColor: color