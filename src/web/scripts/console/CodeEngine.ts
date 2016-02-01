namespace otterside.console {
    export class CodeEngine {
        private static compilerOptions: ts.CompilerOptions = {
            module: ts.ModuleKind.CommonJS,
            charset: 'UTF-8'
        };

        /**
         * Runs the script specified by the runconfig
         * @param {RunConfig} runConfig the configuration for the current script execution
         */
        public static run(runConfig: RunConfig): void {
            var commandParams = CodeEngine.buildCommandParams();

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
            window.console.log(script);
            return new Function(script);
        }

        private static buildCommandParams(): CommandParams {
            return {
                game: otterside.game,
                gameStates: {
                    PreloadState: PreloadState.stateName,
                    BootState: BootState.stateName,
                    MainMenuState: MainMenuState.stateName,
                    PlayState: PlayState.stateName
                }
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
                runConfig.runNamespace.substring(0, pointIndex);
            }
            else {
                return runConfig.runNamespace;
            }
        }
    }
}
