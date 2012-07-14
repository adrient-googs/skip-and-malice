# main function
$ ->
  b = new Board
  $('#boardContainer').append b.view.el
  
  p = new Pairing
  $('#gameArea').append p.view.el

  c = new Card suit:'S', number:1
  b.view.$el.append(c.view.el)
  
  s = new Stack
  b.view.$el.append(s.view.el)
  
  # hook the card to the stack
  c.view.on 'drag:start', StackView::onDragStart, s.view
  c.view.on 'drag:stop', StackView::onDragStop, s.view
  
  showDebugColors()
  
# this debug function draws a background behind every visible element
# so that they can be laid out
showDebugColors = ->
  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange']
  for color in colors
    $(".test-#{color}").css
      backgroundColor: color