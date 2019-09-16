"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const plugin = __importStar(require("./index"));
const base = __importStar(require("@jupyter-widgets/base"));
module.exports = {
    id: 'ntnu-process-mining',
    requires: [base.IJupyterWidgetRegistry],
    activate: function (app, widgets) {
        widgets.registerWidget({
            name: 'ntnu-process-mining',
            version: plugin.version,
            exports: plugin
        });
    },
    autoStart: true
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGFicGx1Z2luLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2xhYnBsdWdpbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQSxnREFBa0M7QUFDbEMsNERBQThDO0FBRTlDLE1BQU0sQ0FBQyxPQUFPLEdBQUc7SUFDZixFQUFFLEVBQUUscUJBQXFCO0lBQ3pCLFFBQVEsRUFBRSxDQUFDLElBQUksQ0FBQyxzQkFBc0IsQ0FBQztJQUN2QyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUUsT0FBTztRQUM3QixPQUFPLENBQUMsY0FBYyxDQUFDO1lBQ3JCLElBQUksRUFBRSxxQkFBcUI7WUFDM0IsT0FBTyxFQUFFLE1BQU0sQ0FBQyxPQUFPO1lBQ3ZCLE9BQU8sRUFBRSxNQUFNO1NBQ2hCLENBQUMsQ0FBQztJQUNMLENBQUM7SUFDRCxTQUFTLEVBQUUsSUFBSTtDQUNoQixDQUFDIn0=