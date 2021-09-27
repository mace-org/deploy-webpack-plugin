import * as webpack from 'webpack';
import * as path from 'path';
import * as fs from 'fs';
import {Tomcat, TomcatOptions} from 'tomcat-deployer';

export type DeployWebpackPluginOptions = {
    tomcat?: TomcatOptions,
    warFile?: string
    contextPath?: string
}

export class DeployWebpackPlugin implements webpack.Plugin {

    public static readonly pluginName = 'deploy-webpack-plugin';

    private readonly _opts: DeployWebpackPluginOptions;

    constructor(options: DeployWebpackPluginOptions = {}) {
        this._opts = {...options};
    }

    async deploy(compilation: webpack.compilation.Compilation, logger: webpack.Logger) {
        let warFile = this._opts.warFile;
        if (warFile) {
            if (!compilation.assets[warFile]) {
                logger.error(`The war asset “${warFile}” is not exists.`);
                return;
            }
        } else {
            warFile = Object.keys(compilation.assets).find(a => a.toLowerCase().endsWith('.war'));
            if (!warFile) {
                logger.error(`Unable to find any war assets.`);
                return;
            }
        }

        const filePath = path.join(compilation.compiler.outputPath, warFile);

        /* istanbul ignore next */
        if (!fs.existsSync(filePath)) {
            logger.error(`The war file “${warFile}” is not exists.`);
            return;
        }

        try {
            const tomcat = new Tomcat(this._opts.tomcat);
            const result = await tomcat.deploy(filePath, this._opts.contextPath);
            logger.info('The war file “%s” deploy success: %s', warFile, result);
        } catch (e) {
            logger.error('The war file “%s” deploy failed: %s', warFile, e);
        }
    }

    apply(compiler: webpack.Compiler): void {
        compiler.hooks.afterEmit.tapAsync(DeployWebpackPlugin.pluginName, (compilation, callback) => {
            const logger = compiler.getInfrastructureLogger(DeployWebpackPlugin.pluginName);
            this.deploy(compilation, logger).then(() => callback());
        });
    }
}
