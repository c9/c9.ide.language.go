/**
 * Cloud9 Go support
 *
 * @copyright 2015, Ajax.org B.V.
 */
define(function(require, exports, module) {
    main.consumes = [
        "Plugin", "language", "jsonalyzer", "settings",
        "preferences", "preferences.experimental"
    ];
    main.provides = ["language.go"];
    return main;

    function main(options, imports, register) {
        var Plugin = imports.Plugin;
        var language = imports.language;
        var jsonalyzer = imports["jsonalyzer"];
        var experimental = imports["preferences.experimental"];
        var settings = imports.settings;
        var plugin = new Plugin("Ajax.org", main.consumes);
        
        var enabled = experimental.addExperiment("go_completion", false, "Language/Go Code Completion");
        
        plugin.on("load", function() {
            if (!enabled)
                return;
            
            language.registerLanguageHandler("plugins/c9.ide.language.go/worker/go_completer", function(err, handler) {
                if (err) return console.error(err);
                setupHandler(handler);
            });
        });
            
        function setupHandler(handler) {
            settings.on("project/go", sendSettings.bind(null, handler), plugin);
            sendSettings(handler);
        }
        
        function sendSettings(handler) {
            handler.emit("set_go_config", {
                // TODO
            });
        }
        
        plugin.on("unload", function() {
            jsonalyzer.unregisterWorkerHandler("plugins/c9.ide.language.go/worker/go_completer");
        });
        
        /** @ignore */
        register(null, {
            "language.go": plugin
        });
    }
});