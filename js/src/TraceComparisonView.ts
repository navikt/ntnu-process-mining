import { DOMWidgetView } from '@jupyter-widgets/base';

export class TraceComparisonView extends DOMWidgetView {
  public render() {
    /* let result = this.model.get('result'); */
    let activities = this.model.get('activities');
    // let trace = this.model.get('trace');

    let selectionBox = document.createElement('select');
    for (var i = 0; i < activities.length; i++) {
      let option = document.createElement('option');
      option.value = activities[i];
      option.text = activities[i];
      selectionBox.appendChild(option);
    }

    let currentTrace = document.createElement('textarea');

    function selectionOnClick() {
      const newTrace = [...this.model.get('trace'), selectionBox.value];
      currentTrace.value = newTrace.toString();
      this.model.set('trace', newTrace);
      this.model.save_changes();
    }

    selectionBox.addEventListener('change', selectionOnClick.bind(this));

    this.el.appendChild(selectionBox);
    this.el.appendChild(currentTrace);

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
