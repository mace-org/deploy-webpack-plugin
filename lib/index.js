"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TomcatDeployWebpackPlugin = void 0;
var path = __importStar(require("path"));
var fs = __importStar(require("fs"));
var tomcat_deployer_1 = require("tomcat-deployer");
var TomcatDeployWebpackPlugin = /** @class */ (function () {
    function TomcatDeployWebpackPlugin(options) {
        if (options === void 0) { options = {}; }
        this._opts = __assign({}, options);
    }
    TomcatDeployWebpackPlugin.prototype.deploy = function (compilation, logger) {
        return __awaiter(this, void 0, void 0, function () {
            var warFile, filePath, tomcat, result, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        warFile = this._opts.warFile;
                        if (warFile) {
                            if (!compilation.assets[warFile]) {
                                logger.error("The war asset \u201C" + warFile + "\u201D is not exists.");
                                return [2 /*return*/];
                            }
                        }
                        else {
                            warFile = Object.keys(compilation.assets).find(function (a) { return a.toLowerCase().endsWith('.war'); });
                            if (!warFile) {
                                logger.error("Unable to find any war assets.");
                                return [2 /*return*/];
                            }
                        }
                        filePath = path.join(compilation.compiler.outputPath, warFile);
                        /* istanbul ignore next */
                        if (!fs.existsSync(filePath)) {
                            logger.error("The war file \u201C" + warFile + "\u201D is not exists.");
                            return [2 /*return*/];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        tomcat = new tomcat_deployer_1.Tomcat(this._opts.tomcat);
                        return [4 /*yield*/, tomcat.deploy(filePath, this._opts.contextPath)];
                    case 2:
                        result = _a.sent();
                        logger.info('The war file ???%s??? deploy success: %s', warFile, result);
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        logger.error('The war file ???%s??? deploy failed: %s', warFile, e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    TomcatDeployWebpackPlugin.prototype.apply = function (compiler) {
        var _this = this;
        compiler.hooks.afterEmit.tapAsync(TomcatDeployWebpackPlugin.pluginName, function (compilation, callback) {
            var logger = compiler.getInfrastructureLogger(TomcatDeployWebpackPlugin.pluginName);
            _this.deploy(compilation, logger).then(function () { return callback(); });
        });
    };
    TomcatDeployWebpackPlugin.pluginName = 'tomcat-deploy-webpack-plugin';
    return TomcatDeployWebpackPlugin;
}());
exports.TomcatDeployWebpackPlugin = TomcatDeployWebpackPlugin;
