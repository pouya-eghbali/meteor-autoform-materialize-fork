// imports
import { Template } from 'meteor/templating'
import './afObjectField.html'
import { flattenSchema } from '../../utilities/flattenSchema'

Template.afObjectField_materialize.helpers({
  colSize: function (name) {
    let schema = AutoForm.getFormSchema()._schema;
    schema = flattenSchema(schema);
    name = name.replace(/\.\d+/g, '.$');
    let fieldSchema = schema[name] || {};
    let fieldAutoform = fieldSchema.autoform || {};
    let size = fieldAutoform.size || 's12';
    return size;
  },
  groupped: function (fields) {
    let schema = AutoForm.getFormSchema()._schema;
    schema = flattenSchema(schema);    
    let groups = {}
    fields.forEach(function (field) {      
      let autoform = schema[field.name.replace(/\.\d+/g, '.$')].autoform || {};
      const group = autoform.group || 'default';
      const title = autoform.groupTitle || '';
      const help = autoform.groupHelp || '';
      const gorder = autoform.groupOrder != undefined ? autoform.groupOrder : 999;
      const order = autoform.order != undefined ? autoform.order : 999;
      groups[group] = groups[group] || { name: group, fields: [] };
      groups[group].fields.push(field);
      groups[group].order = groups[group].order || gorder;
      groups[group].help = groups[group].help || help;
      groups[group].title = groups[group].title || title;
      field.order = order;
    })
    Object.values(groups).forEach(function (group) {
      group.fields = group.fields.sort((a, b) => {
        return a.order - b.order
      })
    })
    return Object.values(groups).sort((a, b) => {
      return a.order - b.order
    })
  }
});
