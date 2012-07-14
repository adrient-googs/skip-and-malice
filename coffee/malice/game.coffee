# main function
$ ->
  $('body').append 'hello world'
  showDebugColors()
  
# this debug function draws a background behind every visible element
# so that they can be laid out
showDebugColors: ->
  colors = ['blue', 'green', 'red', 'yellow', 'purple', 'orange']
  for color in colors
    $(".test-#{color}").css
      backgroundColor: color