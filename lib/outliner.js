"use babel";
import * as OutlinerContainer from "./outliner-container";
var componentName = "OutlinerContainer";
var layoutName = "main:full";
var OutlinerPlugin = /** @class */ (function () {
    function OutlinerPlugin() {
    }
    OutlinerPlugin.prototype.activate = function () {
        var components = inkdrop.components, commands = inkdrop.commands;
        components.registerClass(OutlinerContainer.default);
        inkdrop.layouts.insertComponentToLayoutAfter(layoutName, "EditorLayout", componentName);
    };
    OutlinerPlugin.prototype.deactivate = function () {
        var components = inkdrop.components, layouts = inkdrop.layouts;
        layouts.removeComponentFromLayout(layoutName, componentName);
        components.deleteClass(OutlinerContainer);
    };
    return OutlinerPlugin;
}());
var plugin = new OutlinerPlugin();
module.exports = {
    config: {
        width: {
            title: "Outliner Width",
            type: "integer",
            default: 250,
        },
    },
    activate: function () {
        plugin.activate();
    },
    deactivate: function () {
        plugin.deactivate();
    },
};
