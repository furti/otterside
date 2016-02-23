namespace otterside.console {
    export class CodeEngine {
        private static allowedGlobals = ['Math'];

        private static compilerOptions: ts.CompilerOptions = {
            module: ts.ModuleKind.CommonJS,
            noLib: true,
            charset: 'UTF-8'
        };

        /**
         * Runs the script specified by the runconfig
         * @param {RunConfig} runConfig the configuration for the current script execution
         */
        public static run(runConfig: RunConfig): void {
            var commandParams = CodeEngine.buildCommandParams(runConfig);

            var scriptFunction = CodeEngine.buildScriptFunction(runConfig);

            var run = scriptFunction();
            run(commandParams);
        }

        private static buildScriptFunction(runConfig: RunConfig): Function {
            var jsSources = CodeEngine.transpile(runConfig),
                rootNamespace = CodeEngine.getRootNamespace(runConfig);

            var script = `
return (function(){
  var ${rootNamespace} = {};

  ${jsSources.join()}

  return ${runConfig.runNamespace}.run;
})();
`;
            script = CodeEngine.sandbox(script);
            Logger.debug('CodeEngine', script);

            return new Function(script);
        }

        private static buildCommandParams(runConfig: RunConfig): CommandParams {
            return {
                game: otterside.game,
                gameManager: otterside.gameManager,
                gameStates: {
                    PreloadState: PreloadState.stateName,
                    BootState: BootState.stateName,
                    MainMenuState: MainMenuState.stateName,
                    PlayState: PlayState.stateName
                },
                console: runConfig.console
            }
        }

        private static transpile(runConfig: RunConfig): string[] {
            var jsSources = [];

            runConfig.scripts.forEach(function(script) {
                jsSources.push(ts.transpile(script, CodeEngine.compilerOptions));
            });

            return jsSources;
        }

        private static getRootNamespace(runConfig: RunConfig): string {
            var pointIndex = runConfig.runNamespace.indexOf('.');

            if (pointIndex > -1) {
                return runConfig.runNamespace.substring(0, pointIndex);
            }
            else {
                return runConfig.runNamespace;
            }
        }

        /**
         * Sandboxes the script by setting window and all its properties to undefined
         * @param {string} script The script to sandbox
         * @return {string} The sandboxed script
         */
        private static sandbox(script: string): string {
            var undefinds = 'var window = undefined';

            Object.getOwnPropertyNames(window).forEach((propertyName) => {
                if (CodeEngine.allowedGlobals.indexOf(propertyName) === -1) {
                    undefinds += `,\n${propertyName} = undefined`;
                }
            });

            undefinds += ';';

            return `
return (function(){
  ${undefinds}

  ${script}
})();
`;
        }
    }
}
