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
  constructor: (attribs={}) ->
    # # set the uid
    # if attribs.calEvents?
    #   util.assertion attribs.uid?, 'Cannot define calEvents without UID.'
    #   @uid = attribs.uid
    # else
    #   util.assertion !attribs.uid?, 'Cannot define UID without calEvents'
    #   @uid = attribs.uid = Stack.EMPTY_UID
        
    # superclass constructor
    super attribs
    # console.log "new calendar: #{@get 'uid'}"

  # after construction
  initialize: (attribs) ->
    # # debug - begin
    # console.log "Stack initialize #{@get 'uid'}, attributes..."
    # console.log attribs
    # # debug - end

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
    # store the card drop
    @card_drop = @$el.find('#cardDrop')
    
    # @model.on 'calEvents:add', (calEvent) => @addEvent calEvent
    # @model.on 'calEvents:remove', (calEvent) => @removeEvent calEvent
    # @model.on 'change:calEvents', StackView::onReplaceCalEvents, @
    # @$el.on 'click', (args...) => @onClick args...
    
  # Called when a card is dragging, and enables the stack to potentially
  # accept the card drop if that is allowed.
  onDragStart: (card) ->
    if @model.accepts card
      console.log "stack accepts card" # <- debug
      # make it visible
      @card_drop.css
        visibility: 'visible'
        pointerEvents: 'auto'
    else
      console.log "stack does not accept card"
    
  # no cards are being dragged, disable drop functionality  
  onDragStop: (card) ->
    # make it invisible
    @card_drop.css
      visibility: 'hidden'
      pointerEvents: 'none'
    
