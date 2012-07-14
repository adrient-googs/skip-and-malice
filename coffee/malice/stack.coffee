# Fundamentally, a Stack is a collection of CalEvent objects.
class Stack extends RemoteModel
  chatter.register(@) # registers the model for unpacking
          
  # # save an instruction
  # @saveNewStack: RemoteModel.remoteStaticMethod 'saveNewStack'
  # 
  # # returns the empty calendar
  # @getEmptyStack: RemoteModel.remoteStaticMethod 'getEmptyStack'
  # 
  # @getStack: RemoteModel.remoteStaticMethod 'getStack'

  # constructor
  constructor: (attribs) ->
    # set attributes based on id
    # switch attribs.id
    #   when 'build1'
    #     attribs.left = '300'
    #     attribs.top =  '300'
    #   when 'build2'
    #     attribs.left = '350'
    #     attribs.top =  '350'
    #   when 'build3'
    #     attribs.left = '400'
    #     attribs.top =  '400'
    #   when 'build4'
    #     attribs.left = '450'
    #     attribs.top =  '450'
      
    console.log 'consructing staCKCKCKC'
    console.log attribs
    super attribs
      
    # # set the uid
    # if attribs.calEvents?
    #   util.assertion attribs.uid?, 'Cannot define calEvents without UID.'
    #   @uid = attribs.uid
    # else
    #   util.assertion !attribs.uid?, 'Cannot define UID without calEvents'
    #   @uid = attribs.uid = Stack.EMPTY_UID
        
    # superclass constructor
    # console.log "new calendar: #{@get 'uid'}"

  # after construction
  initialize: (attribs) ->
    # debug - begin
    console.log "Stack initialize #{@get 'type'}, attributes..."
    console.log attribs
    # debug - end

    # manage calEvents property through private collection
    util.setCollectionAsAttribute @, 'calEvents', (attribs.calEvents ? [])
    @calEvents.comparator = (event) -> event.get 'name'
    
    # create view
    @view = new StackView model:@
    
  # returns true iff this stack accepts this card
  accepts: (card) ->
    return true

class StackView extends Backbone.View
  # constructor
  constructor: (args) ->
    args.el = $('#prototypes .stackView').clone()[0]
    super args

  # after construction
  initialize: ->
    # set up location
    switch @model.get('type')
      when 'build1' then @$el.css left: 263, top: 301
      when 'build2' then @$el.css left: 346, top: 301
      when 'build3' then @$el.css left: 430, top: 301
      when 'build4' then @$el.css left: 514, top: 301
    @$el.attr id: @model.get('type')
    
    # set up the card drop
    @card_drop = @$el.find('#cardDrop')
    @card_drop.droppable
      # disabled: true
      activeClass: 'card-drop-active'
      # accept: '.cardView'
      addClasses: false
      greedy: true
      hoverClass: 'card-drop-hover'
      tolerance: 'intersect'
      activate: => @onDropActivate()
      deactivate: => @onDropDeactivate()
      over: => console.log "droppable - over"
      out: => console.log "droppable - out"
      drop: => console.log "droppable - drop: #{@model.get('type')}"
      
    # @model.on 'calEvents:add', (calEvent) => @addEvent calEvent
    # @model.on 'calEvents:remove', (calEvent) => @removeEvent calEvent
    # @model.on 'change:calEvents', StackView::onReplaceCalEvents, @
    # @$el.on 'click', (args...) => @onClick args...
    
  # when the droppable element is being dragged
  onDropActivate: ->
    console.log "onDropActivate"
    @card_drop.css
      visibility: 'visible'
      pointerEvents: 'auto'
    
  # when the droppable element is no longer being dragged
  onDropDeactivate: ->
    console.log "onDropDeactivate"
    @card_drop.css
      visibility: 'hidden'
      pointerEvents: 'none'
    
  # # Called when a card is dragging, and enables the stack to potentially
  # # accept the card drop if that is allowed.
  # onDragStart: (card) ->
  #   if @model.accepts card
  #     console.log "stack accepts card" # <- debug
  #     # make it visible
  #     # @card_drop.css
  #     #   visibility: 'visible'
  #     #   pointerEvents: 'auto'
  #     # @card_drop.droppable 'disabled', false
  #   else
  #     console.log "stack does not accept card"
  #   
  # # no cards are being dragged, disable drop functionality  
  # onDragStop: (card) ->
  #   # make it invisible
  #   # @card_drop.css
  #   #   visibility: 'hidden'
  #   #   pointerEvents: 'none'
  #   # @card_drop.droppable 'disabled', true
