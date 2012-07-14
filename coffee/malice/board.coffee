# Fundamentally, a Calendar is a collection of CalEvent objects.
class Board extends RemoteModel
  chatter.register(@) # registers the model for unpacking
  
  @STACKS: [
    # where the player can put cards
    'build1', 'build2', 'build3', 'build4'
  ]
  
  # # special UID for the empty calendar
  # @EMPTY_UID = "empty_calendar"
  # 
  # defaults:
  #   uid: @EMPTY_UID
  #   calEvents: undefined
  #       
  # # save an instruction
  # @saveNewCalendar: RemoteModel.remoteStaticMethod 'saveNewCalendar'
  # 
  # # returns the empty calendar
  # @getEmptyCalendar: RemoteModel.remoteStaticMethod 'getEmptyCalendar'
  # 
  # @getCalendar: RemoteModel.remoteStaticMethod 'getCalendar'

  # constructor
  constructor: (attribs={}) ->
    # set default stacks
    for stack in Board.STACKS
      unless stack in attribs
        attribs[stack] = new Stack type:stack
    console.log 'CREATED A STACK'
    console.log attribs.build1
    super attribs

    # # set the uid
    # if attribs.calEvents?
    #   util.assertion attribs.uid?, 'Cannot define calEvents without UID.'
    #   @uid = attribs.uid
    # else
    #   util.assertion !attribs.uid?, 'Cannot define UID without calEvents'
    #   @uid = attribs.uid = Calendar.EMPTY_UID
    #     
    # # superclass constructor
    # super attribs
    # console.log "new calendar: #{@get 'uid'}"

  # after construction
  initialize: (attribs) ->
    # debug - begin
    console.log "CHECKING STACKS"
    for stack in Board.STACKS
      console.log stack
      console.log @get(stack)
    # debug - end 
    
    # create a view
    @view = new BoardView model:@
    
    # # add all stacks to the view
    # @view.$el.append @get('build1').view.el

class BoardView extends Backbone.View
  # constructor
  constructor: (args) ->
    args.el = $('#prototypes .boardView').clone()[0]
    super args

  # after construction
  initialize: ->
    console.log "BoardView -- initialize"
    console.log @el
    console.log @model
    
    # add all the default stacks
    stack_container = @$el.find('#stackContainer')
    for stack in Board.STACKS
      console.log "about to append stack"
      console.log @model.get(stack)
      stack_container.append @model.get(stack).view.el
      
    
    # @model.on 'calEvents:add', (calEvent) => @addEvent calEvent
    # @model.on 'calEvents:remove', (calEvent) => @removeEvent calEvent
    # @model.on 'change:calEvents', CalendarView::onReplaceCalEvents, @
    # @$el.on 'click', (args...) => @onClick args...

