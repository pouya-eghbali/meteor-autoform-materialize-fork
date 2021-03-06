// impoers
import { Template } from 'meteor/templating'
import { ReactiveVar } from 'meteor/reactive-var'
import './select-multiple.html'
import { optionAtts } from '../../utilities/optionAtts'
import { attsToggleInvalidClass } from '../../utilities/attsToggleInvalidClass'
import { initializeSelect } from '../../utilities/initializeSelect'

// worker functions
function isEmptySelect(value) {
  const valueIsEmptyArray = _.isArray(value) &&
      (value.length === 1) && (_.isEmpty(_.first(value)))
  if (_.isEmpty(value) || valueIsEmptyArray) {
    return true
  }
  else {
    return false
  }
}

function placeholder(data) {
  if (data.atts.firstOption) {
    return data.atts.firstOption
  }
  else if (data.atts.placeholder) {
    return data.atts.placeholder
  }
  else return undefined
}

function hasPlaceholder(data) {
  return data.atts.firstOption || data.atts.placeholder?true:false
}

function createItems(data) {
  const items = []

  // get selected values
  let selectedValues = AutoForm.getFieldValue(data.atts.name)

  // normalise selected values (for multiple select)
  if (!_.isArray(selectedValues)) {
    selectedValues = [selectedValues]
  }
  // console.log('selectedValues', selectedValues)

  // if there is a placeholder (or first option)
  if (hasPlaceholder(data)) {

    // define first option
    const firstOption = {
      atts: {
        htmlAttributes: {}
      },
      label: placeholder(data),
      value: '',
      disabled: true,
      selected: false,
      _id: 'AUTOFORM_EMPTY_FIRST_OPTION'
    }

    // add first item
    items.push(firstOption)
  }

  // for each item
  for (let item of data.items) {

    // if item is selected in old values
    if (_.contains(selectedValues, item.value)) {

      // push selected item
      items.push(_.extend(item, {selected: true}))
    }

    // else
    else {

      // push item
      items.push(item)
    }
  }

  // return items
  // console.log('created items', items)
  return items
}

// on created
Template.afSelectMultiple_materialize.onCreated(() => {
  const instance = Template.instance()

  // init items
  instance.items = new ReactiveVar(createItems(instance.data))
})

// on rendered
Template.afSelectMultiple_materialize.onRendered(() => {
  const instance = Template.instance()

  // get select element, query
  const selectQuery = instance.$('select')
  const selectElement = selectQuery.get(0)

  // react when template data changes
  let oldItems
  instance.autorun(() => {
    const data = Template.currentData()
    // console.log('select template data', data)

    // if items changed
    if (!_.isEqual(oldItems, data.items)) {
      // console.log('items changed', oldItems, data.items)

      // assign new items to old items
      oldItems = _.clone(data.items)

      // if select instance exists
      if (instance.selectInstance) {

        // destory previous instance
        instance.selectInstance.destroy()
      }

      // create items
      const itemData = {items: createItems(data)}

      // remove all children of the select element
      // console.log(selectQuery.get(0))
      selectQuery.empty()

      // render items template inside select element
      Blaze.renderWithData(Template.afSelect_materialize_items, itemData, selectElement)

      // init materialize select
      instance.selectInstance = M.FormSelect.init(selectElement)
    }
  })
})

// helpers
Template.afSelectMultiple_materialize.helpers({
  atts: attsToggleInvalidClass,
  optionAtts(option) {
    const atts = {value: option.value}
    if (option.selected) {atts.selected = ''}
    if (option.disabled) {atts.disabled = ''}
    // console.log(`optionAtts for option ${option.label}`, atts)
    return atts
  },

})
