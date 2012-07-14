# Fundamentally, a Calendar is a collection of CalEvent objects.
class Card extends RemoteModel
  chatter.register(@) # registers the model for unpacking

  # ace of spades
  defaults:
    facing: 'front'
    
  @SUITS: ['S', 'H', 'D', 'C']
  
  @NUMBERS:
    1 : 'A'
    2 : '2'
    3 : '3'
    4 : '4'
    5 : '5'
    6 : '6'
    7 : '7'
    8 : '8'
    9 : '9'
    10: '10'
    11: 'J'
    12: 'Q'
    13: 'K'

  # # save an instruction
  # @saveNewCalendar: RemoteModel.remoteStaticMethod 'saveNewCalendar'
  # 
  # # returns the empty calendar
  # @getEmptyCalendar: RemoteModel.remoteStaticMethod 'getEmptyCalendar'
  # 
  # @getCalendar: RemoteModel.remoteStaticMethod 'getCalendar'

  # constructor
  constructor: (attribs={}) ->
    # make sure the suit and number are correct
    util.assertion (attribs?.suit in Card.SUITS), \
      "Incorrect suit: #{attribs.suit}."
    util.assertion ("#{attribs?.number}" in _.keys Card.NUMBERS), \
      "Incorrect number: #{attribs.number}."
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
    console.log "creating new card"
    console.log @attributes
    # debug - end
    
    # create a view
    console.log "about to construct view"
    @view = new CardView model:@
    console.log "created view"
    
  # validates this card
  validate: (attribs) ->
    # can't change suit or number
    return 'Cards are immutable.' if \
      'suit' in attribs or 'number' in attribs
    if 'facing' in attribs
      throw new Error 'user changing which way the card is facing'

class CardView extends Backbone.View
  # constructor
  constructor: (args) ->
    args.el = $('#prototypes .cardView').clone()[0]
    super args

  # after construction
  initialize: ->
    # make it draggable
    @$el.draggable
      containment: 'parent'
      start: => @trigger 'drag:start', @model
      drag: => @trigger 'drag:dragging', @model
      stop: => @trigger 'drag:stop', @model
      
    # event handlers
    @on 'drag:start', CardView::onDragStart, @
    @on 'drag:stop', CardView::onDragStop, @
    
    # set the background
    @render()
  
  # render's the card
  render: ->
    @$el.css backgroundImage: switch @model.get 'facing'
      when 'front'
        number_str = Card.NUMBERS["#{@model.get 'number'}"]
        suit_str = @model.get 'suit'
        "url('/imgs/cards/#{number_str}#{suit_str}.png')"
      when 'back' then "url('/imgs/cards/back.png')"
      else throw new Error 'Card not facing properly.'
      
  # called when the card is being dragged
  onDragStart: (card) ->
    util.assertion (card.cid is @model.cid), \
      "Drag CID mismatch: #{card.cid} != #{@model.cid}."
    @$el.css zIndex: 3000
    console.log "onDragStart"
    
  onDragStop: (card) ->
    util.assertion (card.cid is @model.cid), \
      "Drag CID mismatch: #{card.cid} != #{@model.cid}."
    @$el.css zIndex: '' # remove the zIndex
    console.log "onDragStop"
      
  # # called when no longer being dragged
  # onDragStop: (args...) ->
  #   console.log "CardView.onStop"
  #   console.log args
  #   
  #   # @model.on 'calEvents:add', (calEvent) => @addEvent calEvent
  #   # @model.on 'calEvents:remove', (calEvent) => @removeEvent calEvent
  #   # @model.on 'change:calEvents', CalendarView::onReplaceCalEvents, @
  #   # @$el.on 'click', (args...) => @onClick args...

