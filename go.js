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
        var preferences = imports.preferences;
        var settings = imports.settings;
        var plugin = new Plugin("Ajax.org", main.consumes);
        
        plugin.on("load", function() {
            
            preferences.add({
                "Project": {
                    "Language Support": {
                        "Go": {
                            position: 500,
                            type: "label",
                            caption: "Go:",
                        },
                        "Enable Go code completion": {
                            position: 510,
                            type: "checkbox",
                            path: "project/go/@completion",
                        },
                        "Format Code on Save": {
                            position: 520,
                            type: "checkbox",
                            path: "project/format/@go_enabled",
                        },
                        "Custom Code Formatter": {
                            position: 530,
                            type: "textbox",
                            path: "project/format/@go_formatter",
                        }
                    }
                }
            }, plugin);
            settings.on("read", function(e) {
                settings.setDefaults("project/go", [
                    ["completion", true],
                ]);
                settings.setDefaults("project/format", [
                    ["go_enabled", true],
                    ["go_formatter", "gofmt $file"],
                ]);
            }, plugin);
            
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
                enabled: settings.get("project/go/@completion"),
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