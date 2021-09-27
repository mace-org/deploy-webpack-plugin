import * as webpack from 'webpack';
import { TomcatOptions } from 'tomcat-deployer';
declare type DeployWebpackPluginOptions = {
    tomcat?: TomcatOptions;
    warFile?: string;
    contextPath?: string;
};
export declare class DeployWebpackPlugin implements webpack.Plugin {
    private readonly _opts;
    constructor(options?: DeployWebpackPluginOptions);
    deploy(compilation: webpack.compilation.Compilation, logger: webpack.Logger): Promise<void>;
    apply(compiler: webpack.Compiler): void;
}
export {};
