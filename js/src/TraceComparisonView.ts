import { DOMWidgetView } from '@jupyter-widgets/base';

export class TraceComparisonView extends DOMWidgetView {
  public render() {
    let result = this.model.get('result');
    let tbody = document.createElement('tbody');

    for (const [key, value] of Object.entries(result)) {
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
      tbody.innerHTML += tr;
    }

    tbody.setAttribute('width', '100%');
    this.el.appendChild(tbody);
  }
}
