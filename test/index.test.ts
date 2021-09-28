import webpack from 'webpack';
import {ArchiveOutputWebpackPlugin} from 'archive-output-webpack-plugin';
import {TomcatDeployWebpackPlugin, TomcatDeployWebpackPluginOptions} from '../src';
import * as deployer from 'tomcat-deployer';
import {TomcatOptions} from 'tomcat-deployer';

const deployMock = jest.fn();
const tomcatMock = (deployer.Tomcat as any) = jest.fn().mockImplementation(function () {
    return {
        deploy: deployMock
    };
});

let errorMock: jest.MockInstance<any, any>;
let infoMock: jest.MockInstance<any, any>;

function createCompiler(buildWar = false) {
    const compiler = webpack({
        mode: 'production',
        context: __dirname,
        entry: './fixtures/index.js',
        plugins: buildWar ? [new ArchiveOutputWebpackPlugin({archiveName: 'test.war'})] : undefined
    });

    const getLogger = compiler.getInfrastructureLogger.bind(compiler);
    compiler.getInfrastructureLogger = jest.fn((name: string) => {
        const logger = getLogger(name);
        if (name === TomcatDeployWebpackPlugin.pluginName) {
            errorMock = jest.spyOn(logger, 'error');
            infoMock = jest.spyOn(logger, 'info');
        }
        return logger;
    })

    return compiler;
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

function run(withWar = false, opts?: TomcatDeployWebpackPluginOptions) {
    const compiler = createCompiler(withWar);
    const plugin = new TomcatDeployWebpackPlugin(opts);
    plugin.apply(compiler);
    return runCompiler(compiler);
}

beforeEach(() => {
    deployMock.mockClear();
    tomcatMock.mockClear();
    errorMock?.mockClear();
    infoMock?.mockClear();
})

test('no any war files', async () => {
    await run();

    expect(errorMock).toBeCalledWith('Unable to find any war assets.');
    expect(tomcatMock).not.toBeCalled();
});

test('find war files', async () => {
    await run(true);

    expect(tomcatMock).toBeCalledTimes(1);
    expect(deployMock).toBeCalledTimes(1);
    expect(deployMock).toBeCalledWith(expect.stringMatching(/\\test\.war$/), undefined);
});

test('invalid war file name', async () => {
    await run(true, {warFile: 'invalid.war'});

    expect(errorMock).toBeCalledWith('The war asset “invalid.war” is not exists.');
    expect(tomcatMock).not.toBeCalled();
});

test('deploy success', async () => {
    const opts: TomcatOptions = {
        interactiveMode: true,
        url: 'test.com',
        user: 'user',
        password: 'password'
    }
    await run(true, {warFile: 'test.war', contextPath: '/test', tomcat: opts});

    expect(tomcatMock).toBeCalledTimes(1);
    expect(tomcatMock).toBeCalledWith(opts);
    expect(deployMock).toBeCalledTimes(1);
    expect(deployMock).toBeCalledWith(expect.stringMatching(/\\test\.war$/), '/test')

    expect(infoMock).toBeCalledWith(expect.stringContaining('deploy success'), expect.anything(), undefined);
});

test('deploy failed', async () => {
    deployMock.mockRejectedValueOnce("failure");
    await run(true);

    expect(tomcatMock).toBeCalledTimes(1);
    expect(deployMock).toBeCalledTimes(1);

    expect(errorMock).toBeCalledWith(expect.stringContaining('deploy failed'), expect.anything(), "failure");
});




