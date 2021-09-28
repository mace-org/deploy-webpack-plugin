import * as webpack from 'webpack';
import { TomcatOptions } from 'tomcat-deployer';
export declare type TomcatDeployWebpackPluginOptions = {
    tomcat?: TomcatOptions;
    warFile?: string;
    contextPath?: string;
};
export declare class TomcatDeployWebpackPlugin implements webpack.Plugin {
    static readonly pluginName = "tomcat-deploy-webpack-plugin";
    private readonly _opts;
    constructor(options?: TomcatDeployWebpackPluginOptions);
    deploy(compilation: webpack.compilation.Compilation, logger: webpack.Logger): Promise<void>;
    apply(compiler: webpack.Compiler): void;
}
