import * as webpack from 'webpack';
import { TomcatOptions } from 'tomcat-deployer';
export declare type DeployWebpackPluginOptions = {
    tomcat?: TomcatOptions;
    warFile?: string;
    contextPath?: string;
};
export declare class DeployWebpackPlugin implements webpack.Plugin {
    static readonly pluginName = "deploy-webpack-plugin";
    private readonly _opts;
    constructor(options?: DeployWebpackPluginOptions);
    deploy(compilation: webpack.compilation.Compilation, logger: webpack.Logger): Promise<void>;
    apply(compiler: webpack.Compiler): void;
}
