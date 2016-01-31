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

            var jsSources = CodeEngine.transpile(runConfig);
            var scriptFunction = CodeEngine.buildScriptFunction(jsSources);

            window.console.log(scriptFunction);

            var run = scriptFunction();
            window.console.log(run);
        }

        private static buildScriptFunction(jsSources: string[]): Function {
            var moduleName = 'mainmenu';

            var script = `
return (function(){
  var ${moduleName} = {};

  ${jsSources.join()}

  return ${moduleName}.run;
})();
            `;

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
    }
}
