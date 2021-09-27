import webpack from 'webpack';
import {ArchiveOutputWebpackPlugin} from 'archive-output-webpack-plugin';
import {DeployWebpackPlugin, DeployWebpackPluginOptions} from '../src';
//import deployer from 'tomcat-deployer';

const deployMock = jest.fn();
const tomcatMock = jest.fn().mockImplementation(() => {
    return {
        deploy: deployMock
    };
});
jest.mock('tomcat-deployer', () => {
    return {Tomcat: tomcatMock};
});

function createCompiler(buildWar = false) {
    return webpack({
        mode: 'production',
        context: __dirname,
        entry: './fixtures/index.js',
        plugins: buildWar ? [new ArchiveOutputWebpackPlugin({archiveName: 'test.war'})] : undefined
    });
}

function runCompiler(compiler: webpack.Compiler) {
    return new Promise<webpack.Stats>((resolve, reject) => {
        compiler.run((err, stats) => {
            if (err) {
                reject(err);
            } else if (stats.hasErrors()) {
                reject(stats.toString());
            } else {
                resolve(stats);
            }
        });
    });
}

function run(withWar = false, opts?: DeployWebpackPluginOptions) {
    const compiler = createCompiler(withWar);
    const plugin = new DeployWebpackPlugin(opts);
    plugin.apply(compiler);
    return runCompiler(compiler);
}

describe('find war file tests', function () {

    it('should\'t found', async () => {
        expect(await run()).toThrow(/Unable to find any war assets/);
        expect(tomcatMock).not.toBeCalled();
        expect(deployMock).not.toBeCalled();
    });

    test('should found', async () => {
        expect(await run(true)).toBeTruthy();
        expect(tomcatMock).toBeCalledTimes(1);
        expect(deployMock).toBeCalledTimes(1);
        expect(deployMock.mock.calls[0][0]).toMatch('/\/main.war$/');
    });

});
