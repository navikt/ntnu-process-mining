import { DOMWidgetView } from '@jupyter-widgets/base';
import Sortable from 'sortablejs';

export class TraceComparisonView extends DOMWidgetView {
  public render() {
    const activities = this.model.get('activities');

    const activitiesList = document.createElement('ul');

    // Create the list of all available activities
    for (const activity of activities) {
      const option = document.createElement('li');
      option.textContent = activity;
      activitiesList.appendChild(option);
    }
    Sortable.create(activitiesList, {
      group: {
        name: 'same',
        pull: 'clone',
        put: false
      },
      sort: false,
      animation: 150
    });

    // Create the list of the built trace
    const traceList = document.createElement('ul');

    Sortable.create(traceList, {
      group: {
        name: 'same'
      },
      animation: 150,
      onAdd: function(event) {
        let option = event.item;
        let button = document.createElement('button');
        let clicked = function(item) {
          item.parentNode.removeChild(item);
          this.el.dispatchEvent(new Event('change'));
        };
        button.textContent = 'X';
        button.onclick = clicked.bind(this, event.item);
        option.appendChild(button);
        event.item.replaceWith(option);
      },
      onSort: function(event) {
        this.el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    let changed = function() {
      // Convert HTML li elements to javascript array
      let selectedActivities = traceList.getElementsByTagName('li');
      let newTrace = [];
      for (const activity of selectedActivities) {
        // Remove button tag
        let regex = /<button.*?<\/button>/gi;
        let result = activity.innerHTML.replace(regex, '');
        newTrace.push(result);
      }

      this.model.set('trace', newTrace);
      this.model.save_changes();
    };

    traceList.addEventListener('change', changed.bind(this));
    this.el.appendChild(activitiesList);
    this.el.appendChild(traceList);

    let table = document.createElement('tbody');

    let resultChanged = function() {
      table.innerHTML = '';
      for (const [key, value] of Object.entries(this.model.get('result'))) {
        let tr = '<tr>';

        /* Must not forget the $ sign */
        tr +=
          '<td> Count: ' +
          value.toString() +
          ' &nbsp; </td>' +
          '<td> Trace: ' +
          key +
          '</td></tr>';

        /* We add the table row to the table body */
        table.innerHTML += tr;
      }

      table.setAttribute('width', '100%');
    };

    this.model.on('change:result', resultChanged, this);
    this.el.appendChild(table);
  }
}
