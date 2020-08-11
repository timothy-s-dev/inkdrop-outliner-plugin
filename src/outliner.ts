"use babel";

import * as OutlinerContainer from "./outliner-container";
import { Inkdrop } from "./types";

const componentName = "OutlinerContainer";
const layoutName = "main:full";

declare var inkdrop: Inkdrop;

class OutlinerPlugin {
  activate() {
    const { components, commands } = inkdrop;
    components.registerClass(OutlinerContainer.default);
    inkdrop.layouts.insertComponentToLayoutAfter(layoutName, "EditorLayout", componentName);
  }

  deactivate() {
    const { components, layouts } = inkdrop;
    layouts.removeComponentFromLayout(layoutName, componentName);
    components.deleteClass(OutlinerContainer);
  }
}

const plugin = new OutlinerPlugin();
module.exports = {
  config: {
    width: {
      title: "Outliner Width",
      type: "integer",
      default: 250,
    },
  },
  activate() {
    plugin.activate();
  },
  deactivate() {
    plugin.deactivate();
  },
};
