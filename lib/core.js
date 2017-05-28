export default {
  context: null,
  document: null,
  selection: null,
  sketch: null,
  plugin: null,

  pluginFolderPath: null,

  frameworks: {
    SketchFetch: {
      SFHttpRequestUtils: 'SFHttpRequestUtils'
    }
  },

  getPluginFolderPath (context) {
    let split = context.scriptPath.split('/');
    split.splice(-3, 3);
    return split.join('/');
  },

  initWithContext (context, pluginName, callbackHandler) {
    this.context = context;
    this.document = this.context.document || this.context.actionContext.document || MSDocument.currentDocument();
    this.selection = this.document.findSelectedLayers();
    this.sketch = this.context.api();
    this.plugin = this.context.plugin;

    this.pluginFolderPath = this.getPluginFolderPath(context);

    this.loadFrameworks();

    // Set variables that the framework cannot figure out by itself..
    SFHttpRequestUtils.setPluginName(pluginName);
    if (callbackHandler) {
      SFHttpRequestUtils.setCallbackHandler(callbackHandler);
    }
  },

  loadFrameworks () {
    for (let framework in this.frameworks) {
      for (let className in this.frameworks[framework]) {
        this.loadFramework(framework, this.frameworks[framework][className]);
      }
    }
  },

  loadFramework (frameworkName, frameworkClass) {
    if (Mocha && NSClassFromString(frameworkClass) == null) {
      const frameworkDir = `${this.pluginFolderPath}/Contents/Resources/frameworks/`;
      const mocha = Mocha.sharedRuntime();
      return mocha.loadFrameworkWithName_inDirectory(frameworkName, frameworkDir);
    }
    return true;
  }
};
