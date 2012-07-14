# Fundamentally, a Calendar is a collection of CalEvent objects.
class Board extends RemoteModel
  chatter.register(@) # registers the model for unpacking

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
    super()
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
    # # manage calEvents property through private collection
    # util.setCollectionAsAttribute @, 'calEvents', (attribs.calEvents ? [])
    # @calEvents.comparator = (event) -> event.get 'name'
    
    # create a view
    console.log "about to construct view"
    @view = new BoardView model:@
    console.log "created view"

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
    
    # @model.on 'calEvents:add', (calEvent) => @addEvent calEvent
    # @model.on 'calEvents:remove', (calEvent) => @removeEvent calEvent
    # @model.on 'change:calEvents', CalendarView::onReplaceCalEvents, @
    # @$el.on 'click', (args...) => @onClick args...

