import { DOMWidgetView } from '@jupyter-widgets/base';
import Sortable from 'sortablejs';

export class TraceComparisonView extends DOMWidgetView {
  public render() {
    const activities = this.model.get('activities');

    const traceBuilder = document.createElement('div');
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
        const option = event.item;
        const button = document.createElement('button');
        const clicked = function(item) {
          item.parentNode.removeChild(item);
          this.el.dispatchEvent(new Event('change'));
        };
        button.textContent = 'X';
        button.onclick = clicked.bind(this, event.item);
        option.insertBefore(button, option.firstChild);
        event.item.replaceWith(option);
      },
      onSort: function(event) {
        this.el.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });

    const changed = function() {
      // Convert HTML li elements to javascript array
      const selectedActivities = traceList.getElementsByTagName('li');
      const newTrace = [];
      for (const activity of selectedActivities) {
        // Remove button tag
        const regex = /<button.*?<\/button>/gi;
        const result = activity.innerHTML.replace(regex, '');
        newTrace.push(result);
      }

      this.model.set('trace', newTrace);
      this.model.save_changes();
    };

    const resultList = document.createElement('ul');

    const resultChanged = function() {
      resultList.innerHTML = '';
      for (const [key, value] of Object.entries(this.model.get('result'))) {
        const resultElement = document.createElement('li');
        resultElement.style.whiteSpace = 'pre';
        const formattedList = key
          .toString()
          .replace('(', '')
          .replace(')', '')
          .trim();
        resultElement.textContent =
          'Count: ' + value.toString().padEnd(5, ' ') + formattedList;
        resultList.appendChild(resultElement);
      }
    };

    this.model.on('change:result', resultChanged, this);

    traceList.addEventListener('change', changed.bind(this));
    const header1 = document.createElement('header');
    header1.textContent = 'Available activities';
    const header2 = document.createElement('header');
    header2.textContent = 'Build the trace (drag and drop)';
    traceBuilder.appendChild(header1);
    traceBuilder.appendChild(header2);
    traceBuilder.appendChild(activitiesList);
    traceBuilder.appendChild(traceList);
    traceBuilder.appendChild(resultList);
    this.el.appendChild(traceBuilder);

    // Styling
    traceBuilder.style.display = 'grid';
    traceBuilder.style.gridTemplateColumns = '1fr 1fr';
    traceBuilder.style.gridTemplateRows = '0.1fr 1fr';
    traceBuilder.style.justifyItems = 'center';

    header1.style.fontWeight = 'bold';
    header2.style.fontWeight = 'bold';

    activitiesList.style.border = '2px solid red';
    activitiesList.style.listStyle = 'none';
    activitiesList.style.width = '45%';
    traceList.style.border = '2px solid red';
    traceList.style.width = '45%';
    traceList.style.listStyle = 'none';
    resultList.style.gridColumn = '1/-1';
    resultList.style.border = '2px solid red';
    resultList.style.listStyle = 'none';
  }
}
